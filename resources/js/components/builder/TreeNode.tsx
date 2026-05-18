import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block } from '@/types/builder';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import { GripVertical, Pencil, Trash2, ChevronRight, ChevronDown, Plus } from 'lucide-react';

interface TreeNodeProps {
    block: Block;
    blockId: string;
    isSelected: boolean;
    level: number;
    onSelect: () => void;
    onDelete: () => void;
    onAddChild: () => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({
    block,
    blockId,
    isSelected,
    level,
    onSelect,
    onDelete,
    onAddChild,
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = block.children && block.children.length > 0;
    const isContainer = block.type === 'section' || (block.definition_slug && ['grid', 'card'].includes(block.definition_slug));

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: blockId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    const displayName = block.type === 'section'
        ? (block.definition_slug || 'Sección')
        : (block.definition_slug || 'Bloque');

    return (
        <div ref={setNodeRef} style={style} className={`relative ${level > 0 ? 'ml-6' : ''}`}>
            <div
                className={`relative group border rounded-lg mb-2 transition-all ${
                    isDragging ? 'shadow-none' : ''
                } ${
                    isSelected
                        ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                        : 'border-border hover:border-primary/50 bg-background'
                }`}
            >
                <div className="flex items-center gap-2 p-2 cursor-pointer" onClick={onSelect}>
                    {hasChildren ? (
                        <button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className="p-0.5 hover:bg-muted rounded">
                            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                    ) : <div className="w-5" />}

                    <div {...attributes} {...listeners} className="cursor-move p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <GripVertical size={14} />
                    </div>

                    <span className="text-sm font-medium truncate flex-1">{displayName}</span>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isContainer && (
                            <button onClick={(e) => { e.stopPropagation(); onAddChild(); }} className="p-1 hover:bg-muted rounded" title="Agregar bloque dentro">
                                <Plus size={14} />
                            </button>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); onSelect(); }} className="p-1 hover:bg-muted rounded" title="Editar">
                            <Pencil size={14} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 hover:bg-destructive/10 text-destructive rounded" title="Eliminar">
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                {isOpen && (
                    <div className="p-3 pt-0 border-t mt-1">
                        <BlockRenderer block={block} isPreview />
                    </div>
                )}
            </div>

            {isOpen && hasChildren && (
                <div className="ml-4 border-l pl-2">
                    {block.children!.map((child, idx) => (
                        <TreeNode
                            key={child.id || `new-${idx}`}
                            block={child}
                            blockId={child.id ? String(child.id) : `new-${idx}`}
                            isSelected={false}
                            level={level + 1}
                            onSelect={() => {}}
                            onDelete={() => {}}
                            onAddChild={() => {}}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TreeNode;