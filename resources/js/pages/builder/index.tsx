import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { route } from 'ziggy-js';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { BreadcrumbItem } from '@/types';
import type { Landing } from '@/types/builder';

interface Props {
    landings: Landing[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Landings', href: '/builder' },
];

export default function BuilderIndex({ landings }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar esta landing?')) {
            router.delete(route('builder.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    // Opcional: mostrar notificación
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Landings" />
            
            <div className="flex flex-col gap-6 p-6">
                {/* Cabecera con título y botón de nueva landing */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Landings</h1>
                        <p className="text-muted-foreground mt-1">
                            Administra tus páginas de aterrizaje
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/builder/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Landing
                        </Link>
                    </Button>
                </div>

                {/* Grid de landings */}
                {landings.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <p className="text-muted-foreground mb-4">
                                No hay landings creadas aún
                            </p>
                            <Button asChild variant="outline">
                                <Link href="/builder/create">
                                    Crear primera landing
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {landings.map((landing) => (
                            <Card key={landing.id} className="overflow-hidden">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span className="truncate">{landing.name}</span>
                                        <Badge variant="outline" className="ml-2">
                                            {landing.blocks?.length || 0} bloques
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-muted-foreground">
                                        Slug: /{landing.slug}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Creada: {format(new Date(landing.created_at), 'PPP', { locale: es })}
                                    </p>
                                </CardContent>
                                <CardFooter className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        asChild
                                        title="Ver landing"
                                    >
                                        <Link href={`/${landing.slug}`} target="_blank">
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        asChild
                                        title="Editar"
                                    >
                                        <Link href={`/builder/${landing.id}/edit`}>
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    ¿Eliminar landing?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Esta acción no se puede deshacer. Se eliminará
                                                    permanentemente la landing "{landing.name}" y
                                                    todos sus bloques.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(landing.id)}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                >
                                                    Eliminar
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}