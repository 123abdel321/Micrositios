import React, { useEffect, useState } from 'react';

interface Props {
    values: Record<string, any>;
    isPreview?: boolean;
    theme?: 'light' | 'dark';
}

const HeaderBlock: React.FC<Props> = ({ values, isPreview = false, theme = 'light' }) => {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    // Seleccionar valores según el tema
    const logo = theme === 'dark' ? values.logo_dark : values.logo_light;
    const bgColor = theme === 'dark' ? values.bg_color_dark : values.bg_color_light;
    const textColor = theme === 'dark' ? values.text_color_dark : values.text_color_light;
    
    const {
        menu_items = [],
        header_height = 80,
        logo_position = 'left'
    } = values;

    const headerStyle: React.CSSProperties = {
        backgroundColor: bgColor || (theme === 'dark' ? '#1a1a1a' : '#ffffff'),
        color: textColor || (theme === 'dark' ? '#ffffff' : '#000000'),
        height: typeof header_height === 'number' ? `${header_height}px` : `${parseInt(header_height)}px`,
        transition: 'all 0.3s ease'
    };

    if (!mounted) return null;

    return (
        <header style={headerStyle} className="w-full px-6 border-b">
            <div className={`container mx-auto h-full flex items-center`}>
                <div className={`flex items-center w-full justify-start`}>
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
                
                <nav className="hidden md:flex space-x-6 ml-auto">
                    {Array.isArray(menu_items) && menu_items.length > 0 ? (
                        menu_items.map((item: any, idx: number) => (
                            <a 
                                key={idx} 
                                href={item.url || '#'} 
                                className="hover:opacity-80 transition-opacity"
                                style={{ color: 'inherit' }}
                            >
                                {item.label || 'Enlace'}
                            </a>
                        ))
                    ) : (
                        <>
                            <a href="#" className="hover:opacity-80">Inicio</a>
                            <a href="#" className="hover:opacity-80">Acerca</a>
                            <a href="#" className="hover:opacity-80">Contacto</a>
                        </>
                    )}
                </nav>
                
                {isPreview && (
                    <div 
                        className="text-xs opacity-60 bg-black/50 text-white px-2 py-1 rounded"
                        style={{ 
                            position: 'absolute', 
                            top: '20px', 
                            left: '30px',
                            zIndex: 50
                        }}
                    >
                        [Header]
                    </div>
                )}
            </div>
        </header>
    );
};

export default HeaderBlock;