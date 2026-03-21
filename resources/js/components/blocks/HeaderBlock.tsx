import React, { useState } from 'react';
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
    
    const logo = theme === 'dark' ? values.logo_dark : values.logo_light;
    const bgColor = theme === 'dark' ? values.bg_color_dark : values.bg_color_light;
    const textColor = theme === 'dark' ? values.text_color_dark : values.text_color_light;
    
    const {
        menu_items = [], // IDs seleccionados
        header_height = 100
    } = values;

    const headerStyle: React.CSSProperties = {
        backgroundColor: bgColor || (theme === 'dark' ? '#1a1a1a' : '#ffffff'),
        color: textColor || (theme === 'dark' ? '#ffffff' : '#000000'),
        height: typeof header_height === 'number' ? `${header_height}px` : `${parseInt(header_height)}px`,
        transition: 'all 0.3s ease',
        position: 'relative',
    };

    // Procesar menu_items: puede ser string, array, o JSON
    const getSelectedIds = (): string[] => {
        if (!menu_items) return [];
        
        if (Array.isArray(menu_items)) {
            return menu_items.map(id => String(id));
        }
        
        if (typeof menu_items === 'string') {
            try {
                const parsed = JSON.parse(menu_items);
                if (Array.isArray(parsed)) {
                    return parsed.map(id => String(id));
                }
                return [String(parsed)];
            } catch {
                return [String(menu_items)];
            }
        }
        
        if (typeof menu_items === 'number') {
            return [String(menu_items)];
        }
        
        return [];
    };

    const getMenuItemsToRender = () => {
        if (loadingMenuItems) return [];
        
        const selectedIds = getSelectedIds();
        
        if (selectedIds.length > 0 && allMenuItems.length > 0) {
            return allMenuItems.filter(item => selectedIds.includes(String(item.id)));
        }
        
        if (allMenuItems.length > 0) {
            return allMenuItems;
        }
        
        // Fallback
        return [
            { id: null, label: 'Inicio', url: '/', target: '_self', active: false },
            { id: null, label: 'Acerca', url: '/sobre-nosotros', target: '_self', active: false },
            { id: null, label: 'Contacto', url: '/contacto', target: '_self', active: false }
        ];
    };

    const menuItemsToRender = getMenuItemsToRender();

    return (
        <header style={headerStyle} className="w-full px-4 md:px-6 relative">
            {isPreview && (
                <div className="text-xs opacity-60 bg-black/50 text-white px-2 py-1 rounded absolute bottom-2 left-2 z-30">
                    [Header]
                </div>
            )}
            
            <div className="container mx-auto h-full flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center shrink-0">
                    {logo ? (
                        <img 
                            src={logo} 
                            alt="Logo" 
                            className="h-8 md:h-10 w-auto object-contain"
                            style={{ filter: theme === 'dark' ? 'brightness(1.2)' : 'none' }}
                        />
                    ) : (
                        <span className="text-lg md:text-xl font-bold">Logo</span>
                    )}
                </div>
                
                {/* Desktop Navigation - hidden on mobile, visible on md and up */}
                <nav className="hidden md:flex space-x-6">
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
                </nav>
                
                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 rounded-md hover:bg-black/10 transition-colors"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>
            
            {/* Mobile Navigation - Dropdown */}
            {mobileMenuOpen && (
                <div 
                    className="absolute top-full left-0 right-0 md:hidden shadow-lg"
                    style={{ 
                        backgroundColor: bgColor || (theme === 'dark' ? '#1a1a1a' : '#ffffff'),
                        borderTop: `1px solid ${theme === 'dark' ? '#333' : '#e5e5e5'}`
                    }}
                >
                    <div className="container mx-auto py-4 px-4 flex flex-col space-y-3">
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
    );
};

export default HeaderBlock;