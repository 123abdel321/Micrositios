import React from 'react';

interface Props {
    values: Record<string, any>;
    isPreview?: boolean;
}

// Función para determinar si un color es oscuro
function isDarkColor(hex: string): boolean {
    if (!hex) return false;
    let r, g, b;
    if (hex.startsWith('#')) {
        const rgb = parseInt(hex.slice(1), 16);
        r = (rgb >> 16) & 0xff;
        g = (rgb >> 8) & 0xff;
        b = (rgb >> 0) & 0xff;
    } else {
        return false;
    }
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
}

const HeaderBlock: React.FC<Props> = ({ values, isPreview = false }) => {
    const { logo, background_color, menu_items } = values;
    const bgColor = background_color || '#ffffff';
    const dark = isDarkColor(bgColor);
    const textColorClass = dark ? 'text-white' : 'text-black';
    const linkHoverClass = dark ? 'hover:text-gray-300' : 'hover:text-primary';

    return (
        <header style={{ backgroundColor: bgColor }} className={`w-full py-4 px-6 border-b ${textColorClass}`}>
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
                            <a key={idx} href={item.url || '#'} className={`${linkHoverClass} transition-colors`}>
                                {item.label || 'Enlace'}
                            </a>
                        ))
                    ) : (
                        <>
                            <a href="#" className={`${linkHoverClass} transition-colors`}>Inicio</a>
                            <a href="#" className={`${linkHoverClass} transition-colors`}>Acerca</a>
                            <a href="#" className={`${linkHoverClass} transition-colors`}>Contacto</a>
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