// components/builder/Builder.tsx
import { useState, useCallback, useMemo, useImperativeHandle, forwardRef } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Module, Block, Landing } from '@/types/builder';
import { createBlockFromModule } from '@/lib/blockUtils';
import BlocksPanel from './BlocksPanel';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';

export interface BuilderRef {
    getBlocks: () => Block[];
}

interface Props {
    modules: Module[];
    landing: Landing;
    onSave?: (blocks: Block[]) => void;
}

// Tab type para móvil
type MobileTab = 'blocks' | 'canvas' | 'properties';

const Builder = forwardRef<BuilderRef, Props>(({ modules, landing }, ref) => {
    const [blocks, setBlocks] = useState<Block[]>(landing.blocks || []);
    const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
    const [mobileTab, setMobileTab] = useState<MobileTab>('canvas');

    // Cuando se selecciona un bloque en móvil, ir automáticamente a propiedades
    const handleSelectBlock = useCallback((index: number) => {
        setSelectedBlockIndex(index);
        setMobileTab('properties');
    }, []);

    // Cuando se agrega un bloque en móvil, ir al canvas
    const handleAddBlock = useCallback((module: Module) => {
        const newBlock = createBlockFromModule(module, blocks.length);
        setBlocks(prev => [...prev, newBlock]);
        setSelectedBlockIndex(blocks.length);
        setMobileTab('canvas');
    }, [blocks]);

    useImperativeHandle(ref, () => ({ getBlocks: () => blocks }));

    const moduleMap = useMemo(() => {
        const map = new Map<number, Module>();
        modules.forEach(m => map.set(m.id, m));
        return map;
    }, [modules]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDeleteBlock = useCallback((index: number) => {
        setBlocks(prev => prev.filter((_, i) => i !== index));
        if (selectedBlockIndex === index) {
            setSelectedBlockIndex(null);
        } else if (selectedBlockIndex !== null && selectedBlockIndex > index) {
            setSelectedBlockIndex(selectedBlockIndex - 1);
        }
    }, [selectedBlockIndex]);

    const handleBlockChange = useCallback((updatedBlock: Block) => {
        if (selectedBlockIndex === null) return;
        setBlocks(prev => {
            const next = [...prev];
            next[selectedBlockIndex] = updatedBlock;
            return next;
        });
    }, [selectedBlockIndex]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setBlocks(items => {
                const oldIndex = items.findIndex((item, i) => (item.id || `new-${i}`) === active.id);
                const newIndex = items.findIndex((item, i) => (item.id || `new-${i}`) === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }, []);

    const itemsWithId = blocks.map((block, index) => ({
        ...block,
        uniqueId: block.id || `new-${index}`,
    }));

    const canvasContent = (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={itemsWithId.map(i => i.uniqueId)} strategy={verticalListSortingStrategy}>
                <Canvas
                    blocks={blocks}
                    selectedBlockIndex={selectedBlockIndex}
                    onSelectBlock={handleSelectBlock}
                    onDeleteBlock={handleDeleteBlock}
                />
            </SortableContext>
        </DndContext>
    );

    const tabs: { key: MobileTab; label: string; icon: string }[] = [
        { key: 'blocks', label: 'Bloques', icon: '⊞' },
        { key: 'canvas', label: 'Canvas', icon: '▦' },
        { key: 'properties', label: 'Props', icon: '⚙' },
    ];

    return (
        <div className="flex flex-col h-full overflow-hidden">

            {/* ── MOBILE: Tab bar ── */}
            <div className="flex border-b md:hidden">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setMobileTab(tab.key)}
                        className={`flex-1 py-2 text-sm font-medium flex flex-col items-center gap-0.5 transition-colors
                            ${mobileTab === tab.key
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <span className="text-base">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── MOBILE: Contenido según tab activo ── */}
            <div className="flex-1 overflow-hidden md:hidden">
                <div className={`h-full overflow-y-auto ${mobileTab !== 'blocks' ? 'hidden' : ''}`}>
                    <BlocksPanel modules={modules} onAddBlock={handleAddBlock} />
                </div>
                <div className={`h-full overflow-y-auto ${mobileTab !== 'canvas' ? 'hidden' : ''}`}>
                    {canvasContent}
                </div>
                <div className={`h-full overflow-y-auto ${mobileTab !== 'properties' ? 'hidden' : ''}`}>
                    <PropertiesPanel
                        block={selectedBlockIndex !== null ? blocks[selectedBlockIndex] : null}
                        moduleMap={moduleMap}
                        onBlockChange={handleBlockChange}
                    />
                </div>
            </div>

            {/* ── TABLET/DESKTOP: Layout horizontal ── */}
            <div className="hidden md:flex flex-1 overflow-hidden">

                {/* Panel izquierdo */}
                <div className="w-56 lg:w-64 border-r overflow-y-auto shrink-0">
                    <BlocksPanel modules={modules} onAddBlock={handleAddBlock} />
                </div>

                {/* Canvas central */}
                <div className="flex-1 overflow-y-auto min-w-0">
                    {canvasContent}
                </div>

                {/* Panel derecho — se oculta en md si no hay bloque seleccionado, 
                    ahorras espacio en tablet */}
                <div className={`border-l overflow-y-auto shrink-0 transition-all duration-200
                    ${selectedBlockIndex !== null
                        ? 'w-72 lg:w-80'
                        : 'w-0 lg:w-80 overflow-hidden'
                    }`}>
                    <PropertiesPanel
                        block={selectedBlockIndex !== null ? blocks[selectedBlockIndex] : null}
                        moduleMap={moduleMap}
                        onBlockChange={handleBlockChange}
                    />
                </div>

            </div>
        </div>
    );
});

export default Builder;