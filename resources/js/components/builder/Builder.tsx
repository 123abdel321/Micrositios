// components/builder/Builder.tsx
import React, { useState, useCallback, useMemo, useImperativeHandle, forwardRef } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
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

const Builder = forwardRef<BuilderRef, Props>(({ modules, landing, onSave }, ref) => {
    const [blocks, setBlocks] = useState<Block[]>(landing.blocks || []);
    const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);

    // Exponer método getBlocks al padre
    useImperativeHandle(ref, () => ({
        getBlocks: () => blocks,
    }));

    // Mapa para búsqueda rápida de módulos
    const moduleMap = useMemo(() => {
        const map = new Map<number, Module>();
        modules.forEach(m => map.set(m.id, m));
        return map;
    }, [modules]);

    // Sensores para drag & drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleAddBlock = useCallback((module: Module) => {
        const newBlock = createBlockFromModule(module, blocks.length);
        setBlocks([...blocks, newBlock]);
        setSelectedBlockIndex(blocks.length); // seleccionar el nuevo bloque
    }, [blocks]);

    const handleDeleteBlock = useCallback((index: number) => {
        setBlocks(blocks.filter((_, i) => i !== index));
        if (selectedBlockIndex === index) {
            setSelectedBlockIndex(null);
        } else if (selectedBlockIndex !== null && selectedBlockIndex > index) {
            setSelectedBlockIndex(selectedBlockIndex - 1);
        }
    }, [blocks, selectedBlockIndex]);

    const handleBlockChange = useCallback((updatedBlock: Block) => {
        if (selectedBlockIndex === null) return;
        const newBlocks = [...blocks];
        newBlocks[selectedBlockIndex] = updatedBlock;
        setBlocks(newBlocks);
    }, [blocks, selectedBlockIndex]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setBlocks((items) => {
                const oldIndex = items.findIndex(item => (item.id || `new-${items.indexOf(item)}`) === active.id);
                const newIndex = items.findIndex(item => (item.id || `new-${items.indexOf(item)}`) === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }, []);

    // Preparar items para SortableContext (necesitan un id único)
    const itemsWithId = blocks.map((block, index) => ({
        ...block,
        uniqueId: block.id || `new-${index}`,
    }));

    return (
        <div className="flex h-screen">
            {/* Panel izquierdo: bloques disponibles */}
            <div className="w-64">
                <BlocksPanel modules={modules} onAddBlock={handleAddBlock} />
            </div>

            {/* Área central: canvas con bloques */}
            <div className="flex-1 overflow-hidden">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={itemsWithId.map(item => item.uniqueId)}
                        strategy={verticalListSortingStrategy}
                    >
                        <Canvas
                            blocks={blocks}
                            selectedBlockIndex={selectedBlockIndex}
                            onSelectBlock={setSelectedBlockIndex}
                            onDeleteBlock={handleDeleteBlock}
                        />
                    </SortableContext>
                </DndContext>
            </div>

            {/* Panel derecho: propiedades del bloque seleccionado */}
            <div className="w-80">
                <PropertiesPanel
                    block={selectedBlockIndex !== null ? blocks[selectedBlockIndex] : null}
                    moduleMap={moduleMap}
                    onBlockChange={handleBlockChange}
                />
            </div>
        </div>
    );
});

export default Builder;