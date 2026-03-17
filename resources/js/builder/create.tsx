import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Builder', href: route('builder.index') },
    { title: 'Crear', href: route('builder.create') },
];

export default function Create() {
    const [form, setForm] = useState({ name: '', slug: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('builder.store'), form);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Landing" />
            <div className="p-6 max-w-md mx-auto">
                <h1 className="text-2xl font-bold mb-6">Nueva Landing</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            value={form.slug}
                            onChange={e => setForm({ ...form, slug: e.target.value })}
                            required
                        />
                    </div>
                    <Button type="submit">Crear</Button>
                </form>
            </div>
        </AppLayout>
    );
}