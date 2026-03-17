// components/blocks/HeroBlock.tsx
import React from 'react';

interface Props {
    values: Record<string, any>;
    isPreview?: boolean;
}

const HeroBlock: React.FC<Props> = ({ values, isPreview = false }) => {
    const { title, subtitle, background_image, cta_button } = values;

    const heroStyle = {
        backgroundImage: background_image ? `url(${background_image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    // Si no hay imagen de fondo, usar un gradiente por defecto
    const bgClass = background_image ? '' : 'bg-gradient-to-r from-primary/10 to-primary/5';

    return (
        <section style={heroStyle} className={`w-full py-20 px-6 ${bgClass}`}>
            <div className="container mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {title || 'Título principal'}
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    {subtitle || 'Subtítulo de la sección hero'}
                </p>
                {cta_button && Array.isArray(cta_button) && cta_button.length > 0 ? (
                    <div className="flex justify-center gap-4">
                        {cta_button.map((btn: any, idx: number) => (
                            <a
                                key={idx}
                                href={btn.url || '#'}
                                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90"
                            >
                                {btn.label || 'Botón'}
                            </a>
                        ))}
                    </div>
                ) : (
                    <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90">
                        Llamada a la acción
                    </button>
                )}
                {isPreview && (
                    <div className="mt-4 text-xs text-muted-foreground">[Hero]</div>
                )}
            </div>
        </section>
    );
};

export default HeroBlock;