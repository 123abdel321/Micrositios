import React from 'react';

interface Props {
    values: Record<string, any>;
    isPreview?: boolean;
    theme?: 'light' | 'dark';
}

interface Column {
    title: string;
    links: Array<{
        label: string;
        url: string;
        target?: '_blank' | '_self';
    }>;
}

interface SocialNetwork {
    platform: string;
    url: string;
    icon?: string;
    active: boolean;
}

const FooterBlock: React.FC<Props> = ({ values, isPreview = false, theme = 'light' }) => {

    // Valores según tema
    const bgColor = theme === 'dark' ? values.bg_color_dark : values.bg_color_light;
    const textColor = theme === 'dark' ? values.text_color_dark : values.text_color_light;
    
    const {
        copyright_text = '© 2026 Tu Empresa. Todos los derechos reservados.',
        columns_count = 4,
        footer_columns = [],
        social_networks = [],
        show_social = true,
        social_position = 'bottom',
        padding_top = 40,
        padding_bottom = 40,
        show_top_border = false,
        border_color = '#dee2e6',
        footer_width = 'container'
    } = values;

    const footerStyle: React.CSSProperties = {
        backgroundColor: bgColor || (theme === 'dark' ? '#1a1a1a' : '#f8f9fa'),
        color: textColor || (theme === 'dark' ? '#ffffff' : '#333333'),
        paddingTop: typeof padding_top === 'number' ? `${padding_top}px` : `${parseInt(padding_top)}px`,
        paddingBottom: typeof padding_bottom === 'number' ? `${padding_bottom}px` : `${parseInt(padding_bottom)}px`,
        ...((show_top_border === true || show_top_border === 1 || show_top_border === '1') && {
            borderTop: `1px solid ${border_color}`
        })
    };

    const getContainerClass = () => {
        switch (footer_width) {
            case 'full':
                return 'w-full px-6';
            case 'container-fluid':
                return 'container-fluid px-4';
            default:
                return 'container mx-auto px-4';
        }
    };

    const getGridCols = () => {
        const cols = Math.min(columns_count, 6);
        return `grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols}`;
    };

    // FooterBlock.tsx - Actualiza renderSocialNetworks
    const renderSocialNetworks = () => {
        // Si social_networks es un array de strings (IDs o nombres de plataformas)
        let activeSocials: SocialNetwork[] = [];
        
        if (Array.isArray(social_networks)) {
            // Si es array de strings, convertirlos a objetos
            activeSocials = social_networks.map((platform: string) => ({
                platform: platform,
                url: `https://${platform}.com/tuempresa`,
                icon: platform.slice(0, 2).toUpperCase(),
                active: true
            }));
        } else if (typeof social_networks === 'string' && social_networks) {
            try {
                const parsed = JSON.parse(social_networks);
                if (Array.isArray(parsed)) {
                    activeSocials = parsed;
                }
            } catch (e) {
                // Si no es JSON, podría ser un string separado por comas
                const platforms = social_networks.split(',').map(p => p.trim());
                activeSocials = platforms.map(platform => ({
                    platform: platform,
                    url: `https://${platform}.com/tuempresa`,
                    icon: platform.slice(0, 2).toUpperCase(),
                    active: true
                }));
            }
        }
        
        if (activeSocials.length === 0) return null;

        return (
            <div className="flex space-x-4 justify-center lg:justify-start">
                {activeSocials.map((social: SocialNetwork, idx: number) => (
                    <a
                        key={idx}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity text-2xl"
                        style={{ color: 'inherit' }}
                        aria-label={social.platform}
                    >
                        {social.icon || social.platform.slice(0, 2).toUpperCase()}
                    </a>
                ))}
            </div>
        );
    };

    const renderColumns = () => {
        if (!footer_columns || footer_columns.length === 0) {
            // Columnas por defecto
            return (
                <>
                    <div>
                        <h3 className="font-semibold mb-4">Enlaces</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:underline">Inicio</a></li>
                            <li><a href="#" className="hover:underline">Acerca</a></li>
                            <li><a href="#" className="hover:underline">Contacto</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:underline">Privacidad</a></li>
                            <li><a href="#" className="hover:underline">Términos</a></li>
                        </ul>
                    </div>
                </>
            );
        }

        return footer_columns.map((column: Column, idx: number) => (
            <div key={idx}>
                <h3 className="font-semibold mb-4">{column.title}</h3>
                <ul className="space-y-2">
                    {column.links && column.links.map((link, linkIdx) => (
                        <li key={linkIdx}>
                            <a 
                                href={link.url}
                                target={link.target || '_self'}
                                className="hover:underline transition-all"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        ));
    };

    return (
        <footer style={footerStyle} className="w-full">
            {/* Preview indicator */}
            {isPreview && (
                <div 
                    className="text-xs opacity-60 bg-black/50 text-white px-2 py-1 rounded"
                    style={{
                        position: 'absolute',
                        bottom: 25,
                        left: 25,
                        zIndex: 50
                    }}
                >
                    [Footers]
                </div>
            )}
            <div className={getContainerClass()}>
                {/* Redes sociales arriba */}
                {show_social && social_position === 'top' && (
                    <div className="mb-8">
                        {renderSocialNetworks()}
                    </div>
                )}

                {/* Columnas */}
                <div className={`grid ${getGridCols()} gap-8 mb-8`}>
                    {renderColumns()}

                    {/* Redes sociales por columna */}
                    {show_social && social_position === 'per_column' && (
                        <div>
                            <h3 className="font-semibold mb-4">Síguenos</h3>
                            {renderSocialNetworks()}
                        </div>
                    )}
                </div>

                {/* Redes sociales abajo */}
                {show_social && social_position === 'bottom' && (
                    <div className="mb-6">
                        {renderSocialNetworks()}
                    </div>
                )}

                {/* Copyright */}
                <div className="text-sm text-center pt-6 border-t border-current/20">
                    <p>{copyright_text}</p>
                </div>
            </div>
        </footer>
    );
};

export default FooterBlock;