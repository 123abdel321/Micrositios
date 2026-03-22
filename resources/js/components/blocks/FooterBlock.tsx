import React from 'react';
import { useAppData } from '@/contexts/AppDataContext';
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    MessageCircle,
    Music2,
    Phone,
    Mail,
    MapPin
} from 'lucide-react';

interface Props {
    values: Record<string, any>;
    isPreview?: boolean;
    theme?: 'light' | 'dark';
}

interface ColumnItem {
    id: string;
    type: 'links' | 'social' | 'contact';
    title: string;
    links?: number[];
    socials?: Array<{ platform: string; url: string }>;
    contact?: {
        phones?: string[];
        email?: string;
        address?: string;
        whatsapp?: string;
        whatsapp_message?: string;
    };
}

const FooterBlock: React.FC<Props> = ({ values, isPreview = false, theme = 'light' }) => {
    const { menuItems } = useAppData();

    // Valores según tema
    const bgColor = theme === 'dark' ? values.bg_color_dark : values.bg_color_light;
    const textColor = theme === 'dark' ? values.text_color_dark : values.text_color_light;
    
    const {
        copyright_text = '© 2026 Tu Empresa. Todos los derechos reservados.',
        columns_count = 4,
        footer_columns = [],
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
        const gridClasses: Record<number, string> = {
            1: 'grid-cols-1',
            2: 'grid-cols-1 md:grid-cols-2',
            3: 'grid-cols-1 md:grid-cols-3',
            4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
            5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
            6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-6'
        };
        return gridClasses[cols] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    };

    // Procesar footer_columns - puede ser string JSON o array
    const getColumns = (): ColumnItem[] => {
        if (!footer_columns) return [];

        if (Array.isArray(footer_columns)) {
            return footer_columns;
        }

        if (typeof footer_columns === 'string') {
            try {
                const parsed = JSON.parse(footer_columns);

                if (Array.isArray(parsed)) {
                    return parsed;
                }

                return [];
            } catch (e) {
                console.error('Error parsing footer_columns:', e, footer_columns);
                return [];
            }
        }

        return [];
    };

    const columns = getColumns();

    const renderLinksColumn = (column: ColumnItem) => {
        const linkIds = column.links || [];
        
        // Obtener los items del menú por sus IDs
        const itemsToShow = menuItems?.filter((item) => 
            item.id !== null && linkIds.includes(item.id)
        ) || [];
        
        if (itemsToShow.length === 0) {
            return (
                <ul className="space-y-2">
                    <li><a href="#" className="hover:underline">Sin enlaces</a></li>
                </ul>
            );
        }
        
        return (
            <ul className="space-y-2">
                {itemsToShow.map((item, idx: number) => (
                    <li key={idx}>
                        <a 
                            href={item.url}
                            target="_self"
                            className="hover:underline transition-all"
                            style={{ color: 'inherit' }}
                        >
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        );
    };

    const renderSocialColumn = (column: ColumnItem) => {
        const socials = column.socials || [];
        
        if (socials.length === 0) return null;
        
        return (
            <div className="flex flex-col space-y-3">
                {socials.map((social, idx) => (
                    <a
                        key={idx}
                        href={social.url.startsWith('http') ? social.url : `https://${social.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity flex items-center gap-2"
                        style={{ color: 'inherit' }}
                    >
                        <span className="text-xl">{getSocialIcon(social.platform)}</span>
                        <span>{capitalize(social.platform)}</span>
                    </a>
                ))}
            </div>
        );
    };

    const renderContactColumn = (column: ColumnItem) => {
        const contact = column.contact || {};
        
        return (
            <div className="space-y-3">
                {contact.phones?.map((phone, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <Phone size={16} />
                        <a href={`tel:${phone}`} className="hover:underline">
                            {phone}
                        </a>
                    </div>
                ))}

                {contact.email && (
                    <div className="flex items-center gap-2">
                        <Mail size={16} />
                        <a href={`mailto:${contact.email}`} className="hover:underline">
                            {contact.email}
                        </a>
                    </div>
                )}

                {contact.address && (
                    <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{contact.address}</span>
                    </div>
                )}

                {contact.whatsapp && (
                    <div className="flex items-center gap-2">
                        <MessageCircle size={16} />
                        <a 
                            href={`https://wa.me/${contact.whatsapp}${contact.whatsapp_message ? `?text=${encodeURIComponent(contact.whatsapp_message)}` : ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            WhatsApp
                        </a>
                    </div>
                )}
            </div>
        );
    };

    const getSocialIcon = (platform: string) => {
        const icons: Record<string, React.ReactNode> = {
            facebook: <Facebook size={18} />,
            twitter: <Twitter size={18} />,
            instagram: <Instagram size={18} />,
            linkedin: <Linkedin size={18} />,
            youtube: <Youtube size={18} />,
            whatsapp: <MessageCircle size={18} />,
            tiktok: <Music2 size={18} />
        };

        return icons[platform.toLowerCase()] || <span>🔗</span>;
    };

    const capitalize = (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const renderColumnContent = (column: ColumnItem) => {
        switch (column.type) {
            case 'links':
                return renderLinksColumn(column);
            case 'social':
                return renderSocialColumn(column);
            case 'contact':
                return renderContactColumn(column);
            default:
                return null;
        }
    };

    // Renderizar columnas
    const renderColumns = () => {
        if (columns.length === 0) {
            // Columnas por defecto
            return (
                <>
                    <div>
                        <h3 className="font-semibold mb-4">Enlaces</h3>
                        <ul className="space-y-2">
                            <li><a href="/" className="hover:underline">Inicio</a></li>
                            <li><a href="/sobre-nosotros" className="hover:underline">Acerca</a></li>
                            <li><a href="/contacto" className="hover:underline">Contacto</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li><a href="/privacidad" className="hover:underline">Privacidad</a></li>
                            <li><a href="/terminos" className="hover:underline">Términos</a></li>
                        </ul>
                    </div>
                </>
            );
        }

        return columns.map((column, idx) => (
            <div key={column.id || idx}>
                <h3 className="font-semibold mb-4">{column.title}</h3>
                {renderColumnContent(column)}
            </div>
        ));
    };

    return (
        <footer style={footerStyle} className="w-full relative">
            {isPreview && (
                <div 
                    className="text-xs opacity-60 bg-black/50 text-white px-2 py-1 rounded absolute bottom-2 left-2 z-50"
                >
                    [Footer]
                </div>
            )}
            <div className={getContainerClass()}>
                <div className={`grid ${getGridCols()} gap-8 mb-8`}>
                    {renderColumns()}
                </div>

                {/* Copyright */}
                <div className="text-sm text-center pt-6 border-t border-current/20">
                    <p>{copyright_text}</p>
                </div>
            </div>
        </footer>
    );
};

export default FooterBlock;