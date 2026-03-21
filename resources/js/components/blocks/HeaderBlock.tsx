import React from 'react';
import { useAppData } from '@/contexts/AppDataContext';

interface Props {
    values: Record<string, any>;
    isPreview?: boolean;
    theme?: 'light' | 'dark';
}

const HeaderBlock: React.FC<Props> = ({ values, isPreview = false, theme = 'light' }) => {
    const { menuItems: allMenuItems, loadingMenuItems } = useAppData();
    
    const logo = theme === 'dark' ? values.logo_dark : values.logo_light;
    const bgColor = theme === 'dark' ? values.bg_color_dark : values.bg_color_light;
    const textColor = theme === 'dark' ? values.text_color_dark : values.text_color_light;
    
    const {
        menu_items = [], // IDs seleccionados
        header_height = 80
    } = values;

    const headerStyle: React.CSSProperties = {
        backgroundColor: bgColor || (theme === 'dark' ? '#1a1a1a' : '#ffffff'),
        color: textColor || (theme === 'dark' ? '#ffffff' : '#000000'),
        height: typeof header_height === 'number' ? `${header_height}px` : `${parseInt(header_height)}px`,
        transition: 'all 0.3s ease'
    };

    // Procesar menu_items: puede ser string, array, o JSON
    const getSelectedIds = (): string[] => {
        if (!menu_items) return [];
        
        // Si es array
        if (Array.isArray(menu_items)) {
            return menu_items.map(id => String(id));
        }
        
        // Si es string, intentar parsear JSON
        if (typeof menu_items === 'string') {
            try {
                const parsed = JSON.parse(menu_items);
                if (Array.isArray(parsed)) {
                    return parsed.map(id => String(id));
                }
                return [String(parsed)];
            } catch {
                // Si no es JSON, podría ser un solo ID
                return [String(menu_items)];
            }
        }
        
        // Si es número
        if (typeof menu_items === 'number') {
            return [String(menu_items)];
        }
        
        return [];
    };

    const renderMenuItems = () => {
        if (loadingMenuItems) {
            return <span className="text-sm">Cargando menú...</span>;
        }

        const selectedIds = getSelectedIds();
        // Si hay IDs seleccionados
        if (selectedIds.length > 0 && allMenuItems.length > 0) {
            const selectedItems = allMenuItems.filter(item => 
                selectedIds.includes(String(item.id))
            );
            
            if (selectedItems.length > 0) {
                return selectedItems.map((item, idx) => (
                    <a 
                        key={idx} 
                        href={item.url || '#'} 
                        target={item.target || '_self'}
                        className={`hover:opacity-80 transition-opacity ${item.active ? 'font-bold underline' : ''}`}
                        style={{ color: 'inherit' }}
                    >
                        {item.label}
                    </a>
                ));
            }
        }
        
        // Si no hay seleccionados, mostrar todos los disponibles
        if (allMenuItems.length > 0) {
            return allMenuItems.map((item, idx) => (
                <a 
                    key={idx} 
                    href={item.url || '#'} 
                    target={item.target || '_self'}
                    className={`hover:opacity-80 transition-opacity ${item.active ? 'font-bold underline' : ''}`}
                    style={{ color: 'inherit' }}
                >
                    {item.label}
                </a>
            ));
        }
        
        // Fallback: items por defecto
        return (
            <>
                <a href="/" className="hover:opacity-80">Inicio</a>
                <a href="/sobre-nosotros" className="hover:opacity-80">Acerca</a>
                <a href="/contacto" className="hover:opacity-80">Contacto</a>
            </>
        );
    };

    return (
        <header style={headerStyle} className="w-full px-6 relative">
            {isPreview && (
                <div className="text-xs opacity-60 bg-black/50 text-white px-2 py-1 rounded absolute bottom-2 left-2 z-50">
                    [Header]
                </div>
            )}
            
            <div className="container mx-auto h-full flex items-center justify-between">
                <div className="flex items-center">
                    {logo ? (
                        <img 
                            src={logo} 
                            alt="Logo" 
                            className="h-10 w-auto"
                            style={{ filter: theme === 'dark' ? 'brightness(1.2)' : 'none' }}
                        />
                    ) : (
                        <span className="text-xl font-bold">Logo</span>
                    )}
                </div>
                
                <nav className="hidden md:flex space-x-6">
                    {renderMenuItems()}
                </nav>
            </div>
        </header>
    );
};

export default HeaderBlock;