// components/builder/Builder.tsx
import { useState, useCallback, useMemo, useImperativeHandle, forwardRef, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Module, Block, BlockDefinition, Landing } from '@/types/builder';
import BlocksToolbar from './BlocksToolbar';
import Canvas from './Canvas';
import { toast } from 'sonner';
import PropertiesPanel from './PropertiesPanel';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import { createBlockFromModule, createBlockFromDefinition } from '@/lib/blockUtils'; // necesitas crear esta función

export interface BuilderRef {
    getBlocks: () => Block[];
}

interface Props {
    modules: Module[];
    blockDefinitions: BlockDefinition[];
    landing: Landing;
    onSave?: (blocks: Block[]) => void;
}

type MobileTab = 'blocks' | 'canvas' | 'properties';

const Builder = forwardRef<BuilderRef, Props>(({ modules, blockDefinitions, landing }, ref) => {
    // Estado: árbol de bloques (raíces)
    const [blocksTree, setBlocksTree] = useState<Block[]>(landing.blocks || []);
    const [selectedBlockId, setSelectedBlockId] = useState<number | null>(null);
    const [mobileTab, setMobileTab] = useState<MobileTab>('canvas');
    const [activeDragBlock, setActiveDragBlock] = useState<Block | null>(null);

    // Función para encontrar un bloque en el árbol por ID
    const findBlockById = useCallback((tree: Block[], id: number): Block | null => {
        for (const block of tree) {
            if (block.id === id) return block;
            if (block.children) {
                const found = findBlockById(block.children, id);
                if (found) return found;
            }
        }
        return null;
    }, []);

    // Función para actualizar un bloque en el árbol (inmutable)
    const updateBlockInTree = useCallback((tree: Block[], blockId: number, updater: (block: Block) => Block): Block[] => {
        return tree.map(block => {
            if (block.id === blockId) {
                return updater(block);
            }
            if (block.children) {
                return { ...block, children: updateBlockInTree(block.children, blockId, updater) };
            }
            return block;
        });
    }, []);

    // Función para eliminar un bloque del árbol (y sus hijos)
    const deleteBlockFromTree = useCallback((tree: Block[], blockId: number): Block[] => {
        return tree.filter(block => {
            if (block.id === blockId) return false;
            if (block.children) {
                block.children = deleteBlockFromTree(block.children, blockId);
            }
            return true;
        });
    }, []);

    // Función para insertar un bloque como hijo de otro (o raíz)
    const insertBlock = useCallback((tree: Block[], parentId: number | null, newBlock: Block, order: number): Block[] => {
        if (parentId === null) {
            // Insertar en raíz
            const newTree = [...tree];
            newTree.splice(order, 0, newBlock);
            return newTree;
        }
        return tree.map(block => {
            if (block.id === parentId) {
                const children = block.children || [];
                const newChildren = [...children];
                newChildren.splice(order, 0, newBlock);
                return { ...block, children: newChildren };
            }
            if (block.children) {
                return { ...block, children: insertBlock(block.children, parentId, newBlock, order) };
            }
            return block;
        });
    }, []);

    // Mover un bloque dentro del árbol (cambiar padre y orden)
    const moveBlock = useCallback((tree: Block[], blockId: number, newParentId: number | null, newOrder: number): Block[] => {
        // 1. Extraer el bloque de su posición actual
        let movedBlock: Block | null = null;
        let newTree: Block[] = [];
        const extract = (nodes: Block[]): Block[] => {
            return nodes.filter(node => {
                if (node.id === blockId) {
                    movedBlock = node;
                    return false;
                }
                if (node.children) {
                    node.children = extract(node.children);
                }
                return true;
            });
        };
        newTree = extract([...tree]);

        if (!movedBlock) return tree;

        // 2. Insertarlo en la nueva posición
        return insertBlock(newTree, newParentId, movedBlock, newOrder);
    }, [insertBlock]);

    // Funciones de negocio
    const handleSelectBlock = useCallback((blockId: number) => {
        setSelectedBlockId(blockId);
        setMobileTab('properties');
    }, []);

    const handleDeleteBlock = useCallback((blockId: number) => {
        setBlocksTree(prev => deleteBlockFromTree(prev, blockId));
        if (selectedBlockId === blockId) setSelectedBlockId(null);
    }, [deleteBlockFromTree, selectedBlockId]);

    const handleAddSection = useCallback((module: Module) => {
        const newBlock = createBlockFromModule(module, blocksTree.length);
        setBlocksTree(prev => [...prev, newBlock]);
        if (newBlock.id) setSelectedBlockId(newBlock.id);
    }, [blocksTree]);

    const handleAddBlock = useCallback((definition: BlockDefinition) => {
        // Si hay un bloque seleccionado y es contenedor (sección o grid/card), agregar como hijo
        let parentId: number | null = null;
        if (selectedBlockId) {
            const parent = findBlockById(blocksTree, selectedBlockId);
            if (parent && (parent.type === 'section' || (parent.definition_slug && ['grid', 'card'].includes(parent.definition_slug)))) {
                parentId = selectedBlockId;
            }
        }
        const newBlock = createBlockFromDefinition(definition, 0); // order temporal
        if (parentId) {
            setBlocksTree(prev => insertBlock(prev, parentId, newBlock, (findBlockById(prev, parentId)?.children?.length || 0)));
        } else {
            setBlocksTree(prev => [...prev, newBlock]);
        }
        if (newBlock.id) setSelectedBlockId(newBlock.id);
    }, [selectedBlockId, blocksTree, findBlockById, insertBlock]);

    const handleBlockChange = useCallback((updatedBlock: Block) => {
        const blockId = updatedBlock.id;
        if (blockId == null) return;
        setBlocksTree(prev => updateBlockInTree(prev, blockId, () => updatedBlock));
    }, [updateBlockInTree]);

    // Drag & drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        // Aquí necesitarías lógica para detectar si es reordenamiento dentro del mismo padre o cambio de padre.
        // Por simplicidad, por ahora solo reordenamos dentro del mismo nivel.
        // Para mover entre padres necesitarías un esquema más complejo con droppable areas.
        // Te propongo por ahora mantener la funcionalidad de reordenamiento dentro del mismo padre y mover entre padres mediante botones.
        setActiveDragBlock(null);
    }, []);

    const handleDragStart = (event: DragEndEvent) => {
        const activeId = String(event.active.id);
        const block = findBlockById(blocksTree, parseInt(activeId));
        setActiveDragBlock(block);
    };

    useImperativeHandle(ref, () => ({ getBlocks: () => blocksTree }));

    const selectedBlock = selectedBlockId ? findBlockById(blocksTree, selectedBlockId) : null;

    const canvasContent = (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <Canvas
                blocksTree={blocksTree}
                selectedBlockId={selectedBlockId}
                onSelectBlock={handleSelectBlock}
                onDeleteBlock={handleDeleteBlock}
                onAddChild={(parentId) => {
                    // Mostrar modal para seleccionar tipo de bloque (por implementar)
                    console.log('Agregar hijo a', parentId);
                }}
            />
            <DragOverlay>
                {activeDragBlock ? (
                    <div className="opacity-90 shadow-xl scale-105 bg-white p-2 rounded border">
                        <BlockRenderer block={activeDragBlock} isPreview />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );

    const tabs: { key: MobileTab; label: string; icon: string }[] = [
        { key: 'blocks', label: 'Bloques', icon: '⊞' },
        { key: 'canvas', label: 'Canvas', icon: '▦' },
        { key: 'properties', label: 'Props', icon: '⚙' },
    ];

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Mobile tabs */}
            <div className="flex border-b md:hidden">
                {tabs.map(tab => (
                    <button key={tab.key} onClick={() => setMobileTab(tab.key)} className={`flex-1 py-2 text-sm font-medium flex flex-col items-center gap-0.5 transition-colors ${mobileTab === tab.key ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                        <span className="text-base">{tab.icon}</span>{tab.label}
                    </button>
                ))}
            </div>

            {/* Mobile content */}
            <div className="flex-1 overflow-hidden md:hidden">
                <div className={`h-full overflow-y-auto ${mobileTab !== 'blocks' ? 'hidden' : ''}`}>
                    <BlocksToolbar modules={modules} blockDefinitions={blockDefinitions} onAddSection={handleAddSection} onAddBlock={handleAddBlock} isMobile />
                </div>
                <div className={`h-full overflow-y-auto ${mobileTab !== 'canvas' ? 'hidden' : ''}`}>
                    {canvasContent}
                </div>
                <div className={`h-full overflow-y-auto ${mobileTab !== 'properties' ? 'hidden' : ''}`}>
                    <PropertiesPanel block={selectedBlock} modules={modules} blockDefinitions={blockDefinitions} onBlockChange={handleBlockChange} />
                </div>
            </div>

            {/* Desktop layout */}
            <div className="hidden md:flex flex-col h-full overflow-hidden">
                <div className="border-b bg-gray-50 shrink-0">
                    <BlocksToolbar modules={modules} blockDefinitions={blockDefinitions} onAddSection={handleAddSection} onAddBlock={handleAddBlock} />
                </div>
                <div className="flex flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto min-w-0">{canvasContent}</div>
                    <div className={`border-l overflow-y-auto shrink-0 transition-all duration-200 ${selectedBlockId !== null ? 'w-72 lg:w-80' : 'w-0 lg:w-80 overflow-hidden'}`}>
                        <PropertiesPanel block={selectedBlock} modules={modules} blockDefinitions={blockDefinitions} onBlockChange={handleBlockChange} />
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Builder;