// components/builder/Canvas.tsx
import React from 'react';
import { Block } from '@/types/builder';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableBlockProps {
    block: Block;
    index: number;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
}

const SortableBlock: React.FC<SortableBlockProps> = ({
    block,
    index,
    isSelected,
    onSelect,
    onDelete,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: block.id || `new-${index}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative group border-2 rounded-lg mb-4 transition-all ${
                isDragging ? 'shadow-none' : ''
            } ${
                isSelected
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'
            }`}
        >
            {/* Controles flotantes */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-md shadow-sm border opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    {...attributes}
                    {...listeners}
                    className="p-1.5 hover:bg-muted rounded-l-md cursor-move"
                    title="Arrastrar"
                >
                    <GripVertical className="h-4 w-4" />
                </button>
                <button
                    onClick={onSelect}
                    className="p-1.5 hover:bg-muted"
                    title="Editar"
                >
                    <Pencil className="h-4 w-4" />
                </button>
                <button
                    onClick={onDelete}
                    className="p-1.5 hover:bg-destructive/10 text-destructive rounded-r-md"
                    title="Eliminar"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            {/* Contenido del bloque con preview */}
            <div className="p-4">
                <BlockRenderer block={block} isPreview />
            </div>

            {/* Indicador de selección */}
            {isSelected && (
                <div className="absolute top-2 left-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-md shadow-sm">
                    Seleccionado
                </div>
            )}
        </div>
    );
};

interface Props {
    blocks: Block[];
    selectedBlockIndex: number | null;
    onSelectBlock: (index: number) => void;
    onDeleteBlock: (index: number) => void;
}

const Canvas: React.FC<Props> = ({
    blocks,
    selectedBlockIndex,
    onSelectBlock,
    onDeleteBlock,
}) => {
    return (
        <div className="h-[calc(100vh-140px)] overflow-y-auto p-2 bg-muted/20">
            {blocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed rounded-lg p-8">
                    <p className="mb-2 text-lg">No hay bloques</p>
                    <p className="text-sm">Arrastra bloques desde el panel izquierdo para comenzar</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {blocks.map((block, index) => (
                        <SortableBlock
                            key={block.id || `block-${index}`}
                            block={block}
                            index={index}
                            isSelected={selectedBlockIndex === index}
                            onSelect={() => onSelectBlock(index)}
                            onDelete={() => onDeleteBlock(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Canvas;