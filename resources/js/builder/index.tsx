import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Builder', href: route('builder.index') },
];

export default function Index({ landings }: { landings: any[] }) {
    const deleteLanding = (id: number) => {
        if (confirm('¿Eliminar esta landing?')) {
            router.delete(route('builder.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Landings" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Mis Landings</h1>
                    <Link href={route('builder.create')}>
                        <Button>Nueva Landing</Button>
                    </Link>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    {landings.map(landing => (
                        <Card key={landing.id}>
                            <CardHeader>
                                <CardTitle>{landing.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">Slug: {landing.slug}</p>
                                <div className="flex gap-2">
                                    <Link href={route('builder.edit', landing.id)}>
                                        <Button variant="outline" size="sm">Editar</Button>
                                    </Link>
                                    <Button variant="destructive" size="sm" onClick={() => deleteLanding(landing.id)}>
                                        Eliminar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}