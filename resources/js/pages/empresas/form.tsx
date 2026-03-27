import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { route } from 'ziggy-js';
import { Link } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';

interface Empresa {
    id?: number;
    razon_social: string;
    nit: string;
    dv: string | null;
    email: string;
    telefono: string | null;
    direccion: string | null;
    token_db: string | null;
}

interface Props {
    empresa: Empresa | null;
    pageTitle: string;
}

export default function EmpresaForm({ empresa, pageTitle }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        razon_social: empresa?.razon_social || '',
        nit: empresa?.nit || '',
        dv: empresa?.dv || '',
        email: empresa?.email || '',
        telefono: empresa?.telefono || '',
        direccion: empresa?.direccion || '',
        token_db: empresa?.token_db || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Empresas', href: route('empresas.index') },
        { title: pageTitle, href: '#' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (empresa?.id) {
            put(route('empresas.update', empresa.id));
        } else {
            post(route('empresas.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={pageTitle} />
            
            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{pageTitle}</h1>
                        <p className="text-muted-foreground mt-1">
                            {empresa ? 'Edita los datos de la empresa' : 'Completa los datos para crear una nueva empresa'}
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={route('empresas.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Link>
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Datos de la empresa</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-12 gap-4">

                                {/* Razón Social */}
                                <div className="col-span-12 md:col-span-6 space-y-2">
                                    <Label htmlFor="razon_social">
                                        Razón Social <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="razon_social"
                                        value={data.razon_social}
                                        onChange={(e) => setData('razon_social', e.target.value)}
                                        placeholder="Ej: Empresa S.A.S"
                                        disabled={processing}
                                    />
                                    {errors.razon_social && (
                                        <p className="text-sm text-destructive">{errors.razon_social}</p>
                                    )}
                                </div>

                                {/* NIT (col 2/3) */}
                                <div className="col-span-12 md:col-span-4 space-y-2">
                                    <Label htmlFor="nit">
                                        NIT <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="nit"
                                        value={data.nit}
                                        onChange={(e) => setData('nit', e.target.value)}
                                        placeholder="Ej: 900123456"
                                        disabled={processing}
                                    />
                                    {errors.nit && (
                                        <p className="text-sm text-destructive">{errors.nit}</p>
                                    )}
                                </div>

                                {/* DV (col 1/3) */}
                                <div className="col-span-12 md:col-span-2 space-y-2">
                                    <Label htmlFor="dv">DV</Label>
                                    <Input
                                        id="dv"
                                        value={data.dv}
                                        maxLength={1}
                                        onChange={(e) => setData('dv', e.target.value)}
                                        placeholder="Ej: 1"
                                        disabled={processing}
                                    />
                                    {errors.dv && (
                                        <p className="text-sm text-destructive">{errors.dv}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="col-span-12 md:col-span-6 space-y-2">
                                    <Label htmlFor="email">
                                        Email <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="contacto@empresa.com"
                                        disabled={processing}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email}</p>
                                    )}
                                </div>

                                {/* Teléfono */}
                                <div className="col-span-12 md:col-span-6 space-y-2">
                                    <Label htmlFor="telefono">Teléfono</Label>
                                    <Input
                                        id="telefono"
                                        value={data.telefono}
                                        onChange={(e) => setData('telefono', e.target.value)}
                                        placeholder="Ej: 3001234567"
                                        disabled={processing}
                                    />
                                    {errors.telefono && (
                                        <p className="text-sm text-destructive">{errors.telefono}</p>
                                    )}
                                </div>

                                {/* Dirección (ocupa toda la fila) */}
                                <div className="col-span-12 space-y-2">
                                    <Label htmlFor="direccion">Dirección</Label>
                                    <Input
                                        id="direccion"
                                        value={data.direccion}
                                        onChange={(e) => setData('direccion', e.target.value)}
                                        placeholder="Calle 123 # 45-67"
                                        disabled={processing}
                                    />
                                    {errors.direccion && (
                                        <p className="text-sm text-destructive">{errors.direccion}</p>
                                    )}
                                </div>

                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                            disabled={processing}
                        >
                            <Link href={route('empresas.index')}>
                                Cancelar
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Guardando...' : (empresa ? 'Actualizar' : 'Crear')}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}