// components/builder/BlockItem.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block } from '@/types/builder';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';

interface Props {
    block: Block;
    isSelected: boolean;
    onClick: () => void;
    onDelete: () => void;
}

const BlockItem: React.FC<Props> = ({ block, isSelected, onClick, onDelete }) => {
    const sortableId = block.id ?? `block-${block.order}-${block.module_slug}`;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: sortableId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group">
            <Card
                className={`border-2 ${isSelected ? 'border-primary' : 'border-transparent'} hover:border-primary/50 transition-colors`}
                onClick={onClick}
            >
                <CardContent className="p-0 relative">
                    {/* Controles superpuestos */}
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded shadow p-1">
                        <button
                            {...attributes}
                            {...listeners}
                            className="p-1 hover:bg-muted rounded cursor-move"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <GripVertical className="h-4 w-4" />
                        </button>
                        <button
                            className="p-1 hover:bg-muted rounded"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick();
                            }}
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button
                            className="p-1 hover:bg-destructive/10 text-destructive rounded"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                    
                    {/* Vista previa del bloque */}
                    <div className="pointer-events-none">
                        <BlockRenderer block={block} isPreview />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BlockItem;