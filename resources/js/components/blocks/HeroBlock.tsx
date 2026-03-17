import React from 'react';

interface Props {
    values: Record<string, any>;
    isPreview?: boolean;
}

const HeroBlock: React.FC<Props> = ({ values, isPreview = false }) => {
    const {
        title,
        subtitle,
        background_image,
        background_color,
        text_color,
        button_text,
        button_url,
        button_style,
    } = values;

    const heroStyle: React.CSSProperties = {
        backgroundImage: background_image ? `url(${background_image})` : undefined,
        backgroundColor: background_color || undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: text_color || undefined,
    };

    const getButtonClasses = () => {
        switch (button_style) {
            case 'secondary':
                return 'bg-secondary text-secondary-foreground hover:bg-secondary/90';
            case 'outline':
                return 'border border-input bg-background hover:bg-accent hover:text-accent-foreground';
            default:
                return 'bg-primary text-primary-foreground hover:bg-primary/90';
        }
    };

    return (
        <section style={heroStyle} className="w-full py-20 px-6">
            <div className="container mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {title || 'Título principal'}
                </h1>
                <p className="text-xl mb-8 max-w-2xl mx-auto">
                    {subtitle || 'Subtítulo de la sección hero'}
                </p>
                {(button_text || button_url) && (
                    <a
                        href={button_url || '#'}
                        className={`inline-block px-6 py-3 rounded-md transition-colors ${getButtonClasses()}`}
                    >
                        {button_text || 'Llamada a la acción'}
                    </a>
                )}
                {isPreview && (
                    <div className="mt-4 text-xs text-muted-foreground">[Hero]</div>
                )}
            </div>
        </section>
    );
};

export default HeroBlock;