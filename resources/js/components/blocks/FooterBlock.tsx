import React from 'react';

interface Props {
    values: Record<string, any>;
    isPreview?: boolean;
}

const FooterBlock: React.FC<Props> = ({ values, isPreview = false }) => {
    const { copyright, footer_links, social_networks } = values;

    // Procesar social_networks: puede ser string separado por comas o array
    const socialList = typeof social_networks === 'string'
        ? social_networks.split(',').map(s => s.trim()).filter(Boolean)
        : Array.isArray(social_networks) ? social_networks : [];

    const socialIcons: Record<string, string> = {
        facebook: 'fb',
        twitter: 'tw',
        instagram: 'ig',
        linkedin: 'in',
        youtube: 'yt',
    };

    return (
        <footer className="w-full py-8 px-6 border-t bg-muted/40">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="font-semibold mb-4">Enlaces</h3>
                        <ul className="space-y-2">
                            {Array.isArray(footer_links) && footer_links.length > 0 ? (
                                footer_links.map((link: any, idx: number) => (
                                    <li key={idx}>
                                        <a href={link.url || '#'} className="hover:underline">
                                            {link.label || 'Enlace'}
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <>
                                    <li><a href="#" className="hover:underline">Inicio</a></li>
                                    <li><a href="#" className="hover:underline">Acerca</a></li>
                                    <li><a href="#" className="hover:underline">Contacto</a></li>
                                </>
                            )}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Redes sociales</h3>
                        <div className="flex space-x-4">
                            {socialList.length > 0 ? (
                                socialList.map((net, idx) => (
                                    <a key={idx} href="#" className="text-2xl hover:text-primary">
                                        {socialIcons[net] || net.slice(0, 2).toUpperCase()}
                                    </a>
                                ))
                            ) : (
                                <>
                                    <span>FB</span>
                                    <span>TW</span>
                                    <span>IG</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            {copyright || '© 2026 Tu Empresa. Todos los derechos reservados.'}
                        </p>
                    </div>
                </div>
                {isPreview && (
                    <div className="mt-4 text-xs text-muted-foreground text-center">[Footer]</div>
                )}
            </div>
        </footer>
    );
};

export default FooterBlock;