import React from 'react';
import { Block } from '@/types/builder';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableBlockProps {
    block: Block;
    blockId: string;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
    level: number;
}

const SortableBlock: React.FC<SortableBlockProps> = ({
    block,
    blockId,
    isSelected,
    onSelect,
    onDelete,
    level,
}) => {
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
        opacity: isDragging ? 0 : 1,
    };

    const hasChildren = block.children && block.children.length > 0;

    return (
        <div ref={setNodeRef} style={style} className={`${level > 0 ? 'ml-8' : ''}`}>
            {/* Bloque principal con el diseño original */}
            <div
                className={`relative group border-2 rounded-lg mb-4 transition-all ${
                    isDragging ? 'shadow-none' : ''
                } ${
                    isSelected
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                }`}
            >
                {/* Controles flotantes (exactamente como estaban) */}
                <div className="absolute top-3 right-3 z-60 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-md shadow-sm border opacity-0 group-hover:opacity-100 transition-opacity">
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
                    <div className="absolute top-2 left-2 z-50 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-md shadow-sm">
                        Seleccionado
                    </div>
                )}
            </div>

            {/* Hijos (recursivo) */}
            {hasChildren && (
                <div className="space-y-2">
                    {block.children!.map((child, idx) => (
                        <SortableBlock
                            key={child.id || `child-${idx}`}
                            block={child}
                            blockId={child.id ? String(child.id) : `child-${idx}`}
                            isSelected={false}
                            level={level + 1}
                            onSelect={() => {}}
                            onDelete={() => {}}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

interface Props {
    blocksTree: Block[];
    selectedBlockId: number | null;
    onSelectBlock: (blockId: number) => void;
    onDeleteBlock: (blockId: number) => void;
}

const Canvas: React.FC<Props> = ({
    blocksTree,
    selectedBlockId,
    onSelectBlock,
    onDeleteBlock,
}) => {
    if (blocksTree.length === 0) {
        return (
            <div className="h-[calc(100vh-140px)] overflow-y-auto p-2 bg-muted/20 flex items-center justify-center">
                <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
                    <p className="mb-2 text-lg">No hay secciones</p>
                    <p className="text-sm">Agrega una sección desde la barra superior</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-140px)] overflow-y-auto p-2 bg-muted/20">
            <div className="space-y-4">
                {blocksTree.map((block, idx) => (
                    <SortableBlock
                        key={block.id || `root-${idx}`}
                        block={block}
                        blockId={block.id ? String(block.id) : `root-${idx}`}
                        isSelected={selectedBlockId === block.id}
                        level={0}
                        onSelect={() => block.id && onSelectBlock(block.id)}
                        onDelete={() => block.id && onDeleteBlock(block.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Canvas;