// components/blocks/HeaderBlock.tsx
import React from 'react';

interface Props {
    values: Record<string, any>;
    isPreview?: boolean;
}

const HeaderBlock: React.FC<Props> = ({ values, isPreview = false }) => {
    const { logo, background_color, menu_items } = values;

    const headerStyle = {
        backgroundColor: background_color || '#ffffff',
    };

    return (
        <header style={headerStyle} className="w-full py-4 px-6 border-b">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    {logo ? (
                        <img src={logo} alt="Logo" className="h-10 w-auto" />
                    ) : (
                        <span className="text-xl font-bold">Logo</span>
                    )}
                </div>
                <nav className="hidden md:flex space-x-6">
                    {Array.isArray(menu_items) && menu_items.length > 0 ? (
                        menu_items.map((item: any, idx: number) => (
                            <a key={idx} href={item.url || '#'} className="hover:text-primary">
                                {item.label || 'Enlace'}
                            </a>
                        ))
                    ) : (
                        // Menú por defecto o placeholder
                        <>
                            <a href="#" className="hover:text-primary">Inicio</a>
                            <a href="#" className="hover:text-primary">Acerca</a>
                            <a href="#" className="hover:text-primary">Contacto</a>
                        </>
                    )}
                </nav>
                {isPreview && (
                    <div className="text-xs text-muted-foreground">[Header]</div>
                )}
            </div>
        </header>
    );
};

export default HeaderBlock;