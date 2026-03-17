import { Head, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import Builder, { BuilderRef } from '@/components/builder/Builder';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Module, Landing, Block } from '@/types/builder';
import type { BreadcrumbItem } from '@/types';

interface Props {
    modules: Module[];
    landing: Landing;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Landings', href: '/builder' },
    { title: 'Construir Landing', href: '#' },
];

export default function Edit({ modules, landing }: Props) {
    const [blocks, setBlocks] = useState<Block[]>(() => {
        // Si hay bloques en la landing, transformarlos
        if (landing.blocks && landing.blocks.length > 0) {
            return landing.blocks.map((submission: any) => {
                // Construir objeto Block
                const block: Block = {
                    id: submission.id,
                    module_id: submission.module_id,
                    module_slug: submission.module?.slug || '',
                    module_name: submission.module?.name || '',
                    order: submission.order || 0,
                    values: {},
                };
                // Llenar values desde field_values
                if (submission.field_values && submission.field_values.length > 0) {
                    submission.field_values.forEach((fv: any) => {
                        block.values[fv.component.name] = fv.value;
                    });
                }
                return block;
            });
        }
        return [];
    });
    const [isSaving, setIsSaving] = useState(false);
    const builderRef = useRef<BuilderRef>(null);

    const handleSave = async () => {
        // Obtener los bloques actuales desde el componente Builder
        const blocks = builderRef.current?.getBlocks() || [];
        console.log('handleSave', blocks);

        setIsSaving(true);
        router.post(
            `/builder/${landing.id}/save`,
            { blocks: JSON.stringify(blocks) },
            {
                onSuccess: () => {
                    toast.success('Landing guardada correctamente');
                },
                onError: (errors) => {
                    toast.error('Error al guardar');
                    console.error(errors);
                },
                onFinish: () => setIsSaving(false),
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editando ${landing.name}`} />
            <div className="flex flex-col h-full">
                <div className="border-b p-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">{landing.name}</h1>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Guardando...' : 'Guardar cambios'}
                    </Button>
                </div>
                <Builder
                    ref={builderRef}
                    modules={modules}
                    landing={landing}
                />
            </div>
        </AppLayout>
    );
}