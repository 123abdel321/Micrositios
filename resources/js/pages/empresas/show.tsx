import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Building2, Mail, Phone, MapPin, Database } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { route } from 'ziggy-js';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { BreadcrumbItem } from '@/types';

interface Empresa {
    id: number;
    razon_social: string;
    nit: string;
    dv: string | null;
    email: string;
    telefono: string | null;
    direccion: string | null;
    token_db: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    empresa: Empresa;
}

export default function EmpresaShow({ empresa }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Empresas', href: route('empresas.index') },
        { title: empresa.razon_social, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={empresa.razon_social} />
            
            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{empresa.razon_social}</h1>
                        <p className="text-muted-foreground mt-1">
                            Detalles de la empresa
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={route('empresas.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={route('empresas.edit', empresa.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Información Principal */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Información General
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Razón Social</p>
                                <p className="font-medium">{empresa.razon_social}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">NIT</p>
                                <p className="font-medium">
                                    {empresa.nit}
                                    {empresa.dv && `-${empresa.dv}`}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    {empresa.email}
                                </p>
                            </div>
                            {empresa.telefono && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Teléfono</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        {empresa.telefono}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Información Adicional */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                Información Técnica
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {empresa.direccion && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Dirección</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        {empresa.direccion}
                                    </p>
                                </div>
                            )}
                            {empresa.token_db && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Token DB</p>
                                    <code className="block bg-muted p-2 rounded text-sm font-mono">
                                        {empresa.token_db}
                                    </code>
                                </div>
                            )}
                            <Separator />
                            <div>
                                <p className="text-sm text-muted-foreground">Creada</p>
                                <p className="text-sm">
                                    {format(new Date(empresa.created_at), "PPP 'a las' p", { locale: es })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Última actualización</p>
                                <p className="text-sm">
                                    {format(new Date(empresa.updated_at), "PPP 'a las' p", { locale: es })}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}