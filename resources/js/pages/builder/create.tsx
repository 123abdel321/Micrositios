import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { BreadcrumbItem } from '@/types';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Landings', href: '/builder' },
    { title: 'Nueva Landing', href: '#' },
];

export default function BuilderCreate() {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/builder', { name, slug }, {
            onError: (err) => setErrors(err),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva Landing" />
            <div className="flex justify-center p-6">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle>Crear nueva landing</CardTitle>
                        <CardDescription>
                            Completa los datos para crear una página de aterrizaje.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    className="mt-2"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ej: Landing de ventas"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug (URL)</Label>
                                <Input
                                    id="slug"
                                    className="mt-2"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="ej: landing-ventas"
                                    required
                                />
                                {errors.slug && (
                                    <p className="text-sm text-destructive">{errors.slug}</p>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 mt-4">
                            <Button type="button" variant="outline" asChild>
                                <a href='/builder'>Cancelar</a>
                            </Button>
                            <Button type="submit">Crear landing</Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}