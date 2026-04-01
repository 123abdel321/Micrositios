import { usePage, Link } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, Building2, Blocks } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import { route } from 'ziggy-js';

export function AppSidebar() {

    // 🔥 Ahora sí: usePage dentro del componente
    const { auth } = usePage().props;

    // Items del menú principal según si tiene empresa o no
    let mainNavItems: NavItem[] = [];

    if (auth?.user?.has_empresa) {
        mainNavItems.push(
            {
                title: 'Dashboard',
                href: route('dashboard'),
                icon: LayoutGrid,
            },
            {
                title: 'Empresas',
                href: route('empresas.index'),
                icon: Building2, 
            },
            {
                title: 'Landings',
                href: route('builder.index'),
                icon: Blocks,
            },
        );
    } else {
        mainNavItems.push({
            title: 'Empresas',
            href: route('empresas.index'),
            icon: Building2, 
        });
    }

    // Items del footer
    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: FolderGit2,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}