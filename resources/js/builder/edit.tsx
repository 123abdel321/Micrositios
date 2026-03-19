import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { route } from 'ziggy-js';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import BlockItem from '../components/builder/BlockItem';
import BlockEditor from '../components/blocks/BlockEditor';
import AvailableModules from '../components/builder/AvailableModules';
import type { BreadcrumbItem } from '@/types';
import type { Module, Block, Landing, BlockValues } from '@/types/builder';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Builder', href: route('builder.index') },
    { title: 'Editar', href: '#' },
];

interface Props {
    landing: Landing;
    modules: Module[];
    blocks: Block[];
}

export default function Edit({ landing, modules, blocks: initialBlocks }: Props) {

    const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
    const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

    const getSortableId = (block: Block) => block.id ?? `block-${block.order}-${block.module_slug}`;

    const selectedModule =
        selectedBlock != null
            ? modules.find((module) => module.id === selectedBlock.module_id) ?? null
            : null;

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = blocks.findIndex((block) => getSortableId(block) === active.id);
        const newIndex = blocks.findIndex((block) => getSortableId(block) === over.id);

        if (oldIndex === -1 || newIndex === -1) {
            return;
        }

        const newBlocks = arrayMove(blocks, oldIndex, newIndex).map((block, index) => ({
            ...block,
            order: index,
        }));

        setBlocks(newBlocks);

        router.post(
            route('blocks.reorder', landing.id),
            {
                blocks: newBlocks.map((block) => ({
                    id: block.id,
                    order: block.order,
                })),
            },
            { preserveScroll: true }
        );
    };

    const addBlock = (moduleId: number) => {
        router.post(
            route('blocks.store', landing.id),
            { module_id: moduleId },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    setBlocks(page.props.blocks as Block[]);
                },
            }
        );
    };

    const updateBlockValues = (blockId: number, values: BlockValues) => {
        router.put(
            route('blocks.update', [landing.id, blockId]),
            { values },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    setBlocks(page.props.blocks as Block[]);
                },
            }
        );
    };

    const deleteBlock = (blockId: number) => {
        if (confirm('¿Eliminar este bloque?')) {
            router.delete(route('blocks.destroy', [landing.id, blockId]), {
                preserveScroll: true,
                onSuccess: (page) => {
                    setBlocks(page.props.blocks as Block[]);
                    if (selectedBlock?.id === blockId) {
                        setSelectedBlock(null);
                    }
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editando ${landing.name}`} />

            <div className="flex h-[calc(100vh-4rem)]">
                <div className="w-64 border-r p-4">
                    <h2 className="font-semibold mb-4">Bloques disponibles</h2>
                    <ScrollArea className="h-full">
                        <AvailableModules modules={modules} onAdd={addBlock} />
                    </ScrollArea>
                </div>

                <div className="flex-1 p-4 overflow-auto bg-gray-50 dark:bg-gray-900">
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext
                            items={blocks.map(getSortableId)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-4">
                                {blocks.map((block) => (
                                    <BlockItem
                                        key={getSortableId(block)}
                                        block={block}
                                        isSelected={selectedBlock?.id === block.id}
                                        onClick={() => setSelectedBlock(block)}
                                        onDelete={() => {
                                            if (block.id != null) {
                                                deleteBlock(block.id);
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>

                <div className="w-80 border-l p-4 overflow-auto">
                    {selectedBlock && selectedModule ? (
                        <BlockEditor
                            block={selectedBlock}
                            module={selectedModule}
                            onChange={(fieldName: string, value: unknown) => {
                                if (selectedBlock.id == null) {
                                    return;
                                }

                                const nextValues: BlockValues = {
                                    ...(selectedBlock.values as Record<string, string | number | boolean | null>),
                                    [fieldName]: (value ?? null) as string | number | boolean | null,
                                };

                                setSelectedBlock({
                                    ...selectedBlock,
                                    values: nextValues,
                                });

                                updateBlockValues(selectedBlock.id, nextValues);
                            }}
                        />
                    ) : (
                        <p className="text-muted-foreground">Selecciona un bloque para editar</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}