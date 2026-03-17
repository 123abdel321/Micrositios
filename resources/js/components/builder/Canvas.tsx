// components/builder/Canvas.tsx
import React from 'react';
import { Block } from '@/types/builder';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import { Button } from '@/components/ui/button';
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
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative group border-2 ${isSelected ? 'border-primary' : 'border-transparent'} rounded-lg mb-4`}
        >
            <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded shadow p-1">
                <button
                    {...attributes}
                    {...listeners}
                    className="p-1 hover:bg-muted rounded cursor-move"
                >
                    <GripVertical className="h-4 w-4" />
                </button>
                <button
                    onClick={onSelect}
                    className="p-1 hover:bg-muted rounded"
                >
                    <Pencil className="h-4 w-4" />
                </button>
                <button
                    onClick={onDelete}
                    className="p-1 hover:bg-destructive/10 text-destructive rounded"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
            <div className="pointer-events-none">
                <BlockRenderer block={block} isPreview />
            </div>
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
        <div className="h-full overflow-y-auto p-4">
            {blocks.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground border-2 border-dashed rounded-lg p-8">
                    Arrastra bloques desde el panel izquierdo para comenzar
                </div>
            ) : (
                <div>
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