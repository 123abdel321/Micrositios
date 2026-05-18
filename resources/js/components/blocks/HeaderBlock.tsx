import React, { useState, useEffect } from 'react';
import { useAppData } from '@/contexts/AppDataContext';
import { Menu, X } from 'lucide-react';

interface Props {
    values: Record<string, any>;
    isPreview?: boolean;
    theme?: 'light' | 'dark';
}

const HeaderBlock: React.FC<Props> = ({ values, isPreview = false, theme = 'light' }) => {
    const { menuItems: allMenuItems, loadingMenuItems } = useAppData();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    
    // Valores del header
    const logo = theme === 'dark' ? values.logo_dark : values.logo_light;
    const bgColorRaw = theme === 'dark' ? values.bg_color_dark : values.bg_color_light;
    const textColor = theme === 'dark' ? values.text_color_dark : values.text_color_light;
    
    const {
        menu_items = [],
        header_height = 100,
        header_position = 'sticky',
        container_width = 'container',
        logo_text = '',
        show_logo_text = false,
        menu_alignment = 'right',
        mobile_breakpoint = 'md',
        header_shadow = false,
        shadow_intensity = 'md',
        header_border = false,
        border_color = '#e5e5e5',
        bg_opacity = 100,
        backdrop_blur = 'none'
    } = values;

    // Detectar scroll para añadir sombra dinámica
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getBoxShadow = () => {
        if (!header_shadow) return 'none';
        if (header_position !== 'fixed' && header_position !== 'sticky') return 'none';
        if (!scrolled) return 'none';
        
        const shadows: Record<string, string> = {
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        };
        return shadows[shadow_intensity] || shadows.md;
    };

    const getBackgroundColor = () => {
        let color = bgColorRaw || (theme === 'dark' ? '#1a1a1a' : '#ffffff');
        const opacity = Math.min(100, Math.max(0, Number(bg_opacity) || 100)) / 100;
        
        if (opacity < 1) {
            const hex = color.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return color;
    };

    const getBackdropBlurClass = () => {
        switch (backdrop_blur) {
            case 'sm': return 'backdrop-blur-sm';
            case 'md': return 'backdrop-blur-md';
            case 'lg': return 'backdrop-blur-lg';
            default: return '';
        }
    };

    const headerStyle: React.CSSProperties = {
        backgroundColor: getBackgroundColor(),
        color: textColor || (theme === 'dark' ? '#ffffff' : '#000000'),
        height: typeof header_height === 'number' ? `${header_height}px` : `${parseInt(header_height)}px`,
        transition: 'all 0.3s ease',
        position: header_position === 'fixed' ? 'fixed' : (header_position === 'sticky' ? 'sticky' : 'relative'),
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        boxShadow: getBoxShadow(),
        borderBottom: header_border ? `1px solid ${border_color}` : 'none',
    };

    const getContainerClass = () => {
        switch (container_width) {
            case 'container-fluid': return 'w-full px-4 md:px-6';
            case 'full': return 'w-full px-4 md:px-6';
            default: return 'container mx-auto px-4 md:px-6';
        }
    };

    const getDesktopNavClass = () => {
        const breakpoints: Record<string, string> = {
            sm: 'hidden sm:flex',
            md: 'hidden md:flex',
            lg: 'hidden lg:flex',
            xl: 'hidden xl:flex'
        };
        return breakpoints[mobile_breakpoint] || 'hidden md:flex';
    };

    const getMobileButtonClass = () => {
        const breakpoints: Record<string, string> = {
            sm: 'flex sm:hidden',
            md: 'flex md:hidden',
            lg: 'flex lg:hidden',
            xl: 'flex xl:hidden'
        };
        return breakpoints[mobile_breakpoint] || 'flex md:hidden';
    };

    const getSelectedIds = (): string[] => {
        if (!menu_items) return [];
        if (Array.isArray(menu_items)) return menu_items.map(id => String(id));
        if (typeof menu_items === 'string') {
            try {
                const parsed = JSON.parse(menu_items);
                if (Array.isArray(parsed)) return parsed.map(id => String(id));
                return [String(parsed)];
            } catch { return [String(menu_items)]; }
        }
        if (typeof menu_items === 'number') return [String(menu_items)];
        return [];
    };

    const getMenuItemsToRender = () => {
        if (loadingMenuItems) return [];
        const selectedIds = getSelectedIds();
        if (selectedIds.length > 0 && allMenuItems.length > 0) {
            return allMenuItems.filter(item => selectedIds.includes(String(item.id)));
        }
        if (allMenuItems.length > 0) return allMenuItems;
        return [
            { id: null, label: 'Inicio', url: '/', target: '_self', active: false },
            { id: null, label: 'Acerca', url: '/sobre-nosotros', target: '_self', active: false },
            { id: null, label: 'Contacto', url: '/contacto', target: '_self', active: false }
        ];
    };

    const menuItemsToRender = getMenuItemsToRender();

    const getMenuAlignmentClass = () => {
        switch (menu_alignment) {
            case 'center': return 'justify-center';
            case 'right': return 'justify-end';
            default: return 'justify-start';
        }
    };

    return (
        <>
            <header style={headerStyle} className={`w-full relative ${getBackdropBlurClass()}`}>
                {isPreview && (
                    <div className="text-xs opacity-60 bg-black/50 text-white px-2 py-1 rounded absolute bottom-2 left-2 z-50">
                        [Header]
                    </div>
                )}
                
                <div className={`${getContainerClass()} h-full flex items-center justify-between`}>
                    {/* Logo + texto */}
                    <div className="flex items-center gap-2 shrink-0">
                        {logo ? (
                            <img 
                                src={logo} 
                                alt="Logo" 
                                className="h-8 md:h-10 w-auto object-contain"
                                style={{ filter: theme === 'dark' ? 'brightness(1.2)' : 'none' }}
                            />
                        ) : null}
                        {show_logo_text && logo_text && (
                            <span className="text-lg md:text-xl font-semibold whitespace-nowrap">
                                {logo_text}
                            </span>
                        )}
                        {!logo && !logo_text && (
                            <span className="text-lg md:text-xl font-bold">Logo</span>
                        )}
                    </div>
                    
                    {/* Desktop Navigation */}
                    <nav className={`${getDesktopNavClass()} ${getMenuAlignmentClass()} flex-1 ml-4`}>
                        <div className="flex space-x-6">
                            {menuItemsToRender.map((item, idx) => (
                                <a 
                                    key={idx} 
                                    href={item.url || '#'} 
                                    target={item.target || '_self'}
                                    className={`hover:opacity-80 transition-opacity whitespace-nowrap ${item.active ? 'font-bold underline' : ''}`}
                                    style={{ color: 'inherit' }}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </nav>
                    
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`${getMobileButtonClass()} p-2 rounded-md hover:bg-black/10 transition-colors`}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
                
                {/* Mobile Navigation - Dropdown */}
                {mobileMenuOpen && (
                    <div 
                        className="absolute top-full left-0 right-0 shadow-lg"
                        style={{ 
                            backgroundColor: getBackgroundColor(),
                            borderTop: `1px solid ${border_color}`,
                            zIndex: 49
                        }}
                    >
                        <div className={`${getContainerClass()} py-4 flex flex-col space-y-3`}>
                            {menuItemsToRender.map((item, idx) => (
                                <a 
                                    key={idx} 
                                    href={item.url || '#'} 
                                    target={item.target || '_self'}
                                    className={`hover:opacity-80 transition-opacity py-2 ${item.active ? 'font-bold underline' : ''}`}
                                    style={{ color: 'inherit' }}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </header>
            {/* Espaciador para header fixed */}
            {header_position === 'fixed' && (
                <div style={{ 
                    height: typeof header_height === 'number' ? header_height : parseInt(header_height), 
                    backgroundColor: 'transparent' 
                }} />
            )}
        </>
    );
};

export default HeaderBlock;