// resources/js/pages/empresas/index.tsx
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Eye, Search, X } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { route } from 'ziggy-js';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
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
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
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
    empresas: {
        data: Empresa[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filters: {
        search: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Empresas', href: route('empresas.index') },
];

export default function EmpresasIndex({ empresas, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [deletingEmpresa, setDeletingEmpresa] = useState<Empresa | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('empresas.index'), { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearSearch = () => {
        setSearch('');
        router.get(route('empresas.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = () => {
        if (deletingEmpresa) {
            router.delete(route('empresas.destroy', deletingEmpresa.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setDeletingEmpresa(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Empresas" />
            
            <div className="p-6">
                {/* Header y filtro en una sola línea */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight">Empresas</h1>
                        <Badge variant="secondary" className="h-6 px-2">
                            {empresas.total}
                        </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Buscar..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-64 pl-9 pr-8 h-9 text-sm"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                >
                                    <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                                </button>
                            )}
                        </form>
                        
                        <Button asChild size="sm" className="h-9">
                            <Link href={route('empresas.create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Nueva
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Tabla */}
                <Card className="shadow-sm">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-[30%]">Razón Social</TableHead>
                                    <TableHead className="w-[15%]">NIT</TableHead>
                                    <TableHead className="w-[25%]">Email</TableHead>
                                    <TableHead className="w-[15%]">Teléfono</TableHead>
                                    <TableHead className="w-[15%]">Creado</TableHead>
                                    <TableHead className="w-[10%] text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {empresas.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center">
                                            <p className="text-muted-foreground">No hay empresas registradas</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    empresas.data.map((empresa) => (
                                        <TableRow key={empresa.id} className="group">
                                            <TableCell className="font-medium py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="truncate">{empresa.razon_social}</span>
                                                    {empresa.token_db && (
                                                        <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                                                            DB
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3 font-mono text-sm">
                                                {empresa.nit}
                                                {empresa.dv && `-${empresa.dv}`}
                                            </TableCell>
                                            <TableCell className="py-3 text-sm truncate">
                                                {empresa.email}
                                            </TableCell>
                                            <TableCell className="py-3 text-sm">
                                                {empresa.telefono || '—'}
                                            </TableCell>
                                            <TableCell className="py-3 text-sm">
                                                {format(new Date(empresa.created_at), 'dd/MM/yyyy', { locale: es })}
                                            </TableCell>
                                            <TableCell className="py-3 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                        className="h-8 w-8"
                                                    >
                                                        <Link href={route('empresas.show', empresa.id)}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                        className="h-8 w-8"
                                                    >
                                                        <Link href={route('empresas.edit', empresa.id)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    ¿Eliminar empresa?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Esta acción no se puede deshacer. Se eliminará
                                                                    permanentemente la empresa "{deletingEmpresa?.razon_social}"
                                                                    y todos sus datos asociados.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel onClick={() => setDeletingEmpresa(null)}>
                                                                    Cancelar
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={handleDelete}
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                >
                                                                    Eliminar
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Paginación compacta */}
                {empresas.last_page > 1 && (
                    <div className="flex items-center justify-between mt-4">
                        <p className="text-xs text-muted-foreground">
                            {empresas.from} - {empresas.to} de {empresas.total}
                        </p>
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={empresas.links[0]?.url || '#'}
                                        className={!empresas.links[0]?.url ? 'pointer-events-none opacity-50' : ''}
                                        size="sm"
                                    />
                                </PaginationItem>
                                
                                {empresas.links.slice(1, -1).map((link, index) => (
                                    <PaginationItem key={index}>
                                        <PaginationLink
                                            href={link.url || '#'}
                                            isActive={link.active}
                                            size="sm"
                                        >
                                            {link.label}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                
                                <PaginationItem>
                                    <PaginationNext
                                        href={empresas.links[empresas.links.length - 1]?.url || '#'}
                                        className={!empresas.links[empresas.links.length - 1]?.url ? 'pointer-events-none opacity-50' : ''}
                                        size="sm"
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}