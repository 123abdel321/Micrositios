import React from 'react';

interface Props {
    values: Record<string, any>;
    isPreview?: boolean;
    theme?: 'light' | 'dark';
}

interface MenuItem {
    id: number | null;
    label: string;
    url: string;
    target: '_self' | '_blank';
    active: boolean;
}

const HeaderBlock: React.FC<Props> = ({ values, isPreview = false, theme = 'light' }) => {
    // Seleccionar valores según el tema
    const logo = theme === 'dark' ? values.logo_dark : values.logo_light;
    const bgColor = theme === 'dark' ? values.bg_color_dark : values.bg_color_light;
    const textColor = theme === 'dark' ? values.text_color_dark : values.text_color_light;
    
    const {
        menu_items = [],
        header_height = 80
    } = values;

    const headerStyle: React.CSSProperties = {
        backgroundColor: bgColor || (theme === 'dark' ? '#1a1a1a' : '#ffffff'),
        color: textColor || (theme === 'dark' ? '#ffffff' : '#000000'),
        height: typeof header_height === 'number' ? `${header_height}px` : `${parseInt(header_height)}px`,
        transition: 'all 0.3s ease'
    };

    // Función para renderizar los items del menú
    const renderMenuItems = () => {
        
        if (Array.isArray(menu_items) && menu_items.length > 0) {
            return menu_items.map((item: MenuItem, idx: number) => (
                <a 
                    key={idx} 
                    href={item.url || '#'} 
                    target={item.target || '_self'}
                    className={`hover:opacity-80 transition-opacity ${item.active ? 'font-bold underline' : ''}`}
                    style={{ color: 'inherit' }}
                >
                    {item.label || 'Enlace'}
                </a>
            ));
        }
        
        // Items por defecto si no hay datos
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
            {/* Preview */}
            {isPreview && (
                <div 
                    className="text-xs opacity-60 bg-black/50 text-white px-2 py-1 rounded absolute bottom-2 left-2 z-50"
                >
                    [Header]
                </div>
            )}
            
            {/* Contenido */}
            <div className={`container mx-auto h-full flex items-center justify-between`}>
                <div className="flex items-center">
                    {logo ? (
                        <img 
                            src={logo} 
                            alt="Logo" 
                            className="h-10 w-auto"
                            style={{ 
                                filter: theme === 'dark' ? 'brightness(1.2)' : 'none'
                            }}
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