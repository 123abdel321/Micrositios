import React  from 'react';

interface Props {
    values: Record<string, any>;
    isPreview?: boolean;
    theme?: 'light' | 'dark';
}

const HeroBlock: React.FC<Props> = ({ values, isPreview = false, theme = 'light' }) => {

    // Valores según tema
    const bgColor = theme === 'dark' ? values.bg_color_dark : values.bg_color_light;
    const textColor = theme === 'dark' ? values.text_color_dark : values.text_color_light;
    
    const {
        title,
        subtitle,
        background_image,
        bg_image_size = 'cover',
        bg_image_position = 'center',
        hero_min_height = 400,
        hero_max_height = 800,
        bg_image_repeat = false,
        content_alignment = 'center',
        padding_top = 40,
        padding_bottom = 40,
        padding_left = 20,
        padding_right = 20,
        button_text,
        button_url,
        button_style = 'primary'
    } = values;
    
    const heroStyle: React.CSSProperties = {
        backgroundImage: background_image ? `url(${background_image})` : undefined,
        backgroundColor: bgColor || undefined,
        backgroundSize: bg_image_size,
        backgroundPosition: bg_image_position,
        backgroundRepeat: (bg_image_repeat === true || bg_image_repeat === 1 || bg_image_repeat === '1') ? 'repeat' : 'no-repeat',
        color: textColor || undefined,
        minHeight: typeof hero_min_height === 'number' ? `${hero_min_height}px` : `${parseInt(hero_min_height)}px`,
        maxHeight: typeof hero_max_height === 'number' ? `${hero_max_height}px` : `${parseInt(hero_max_height)}px`,
        paddingTop: typeof padding_top === 'number' ? `${padding_top}px` : `${parseInt(padding_top)}px`,
        paddingBottom: typeof padding_bottom === 'number' ? `${padding_bottom}px` : `${parseInt(padding_bottom)}px`,
        paddingRight: typeof padding_right === 'number' ? `${padding_right}px` : `${parseInt(padding_right)}px`,
        paddingLeft: typeof padding_left === 'number' ? `${padding_left}px` : `${parseInt(padding_left)}px`,
        position: 'relative',
    };

    console.log('heroStyle: ', heroStyle);

    const getButtonClasses = () => {
        const baseClasses = "inline-block px-6 py-3 rounded-md transition-all duration-300 font-medium";
        switch (button_style) {
            case 'secondary':
                return `${baseClasses} bg-secondary text-secondary-foreground hover:bg-secondary/90`;
            case 'outline':
                return `${baseClasses} border-2 border-current bg-transparent hover:bg-current hover:text-background`;
            default:
                return `${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90`;
        }
    };

    const getAlignmentClass = () => {
        switch (content_alignment) {
            case 'left':
                return 'text-left items-start';
            case 'right':
                return 'text-right items-end';
            default:
                return 'text-center items-center';
        }
    };

    return (
        <section style={heroStyle} className="relative overflow-hidden">
            {/* Preview */}
            {isPreview && (
                <div 
                    className="text-xs opacity-60 bg-black/50 text-white px-2 py-1 rounded"
                    style={{
                        position: 'absolute',
                        bottom: 10,
                        left: 10,
                        zIndex: 50
                    }}
                >
                    [Hero]
                </div>
            )}
            {/* Contenido */}
            <div 
                className={`container mx-auto h-full flex flex-col justify-center ${getAlignmentClass()} relative`}
                style={{ 
                    zIndex: 2,
                    minHeight: 'inherit'
                }}
            >
                { title ? (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                        {title}
                    </h1>
                ) : null}
                
                { subtitle ? (
                    <p className="text-xl md:text-2xl mb-8 max-w-2xl">
                        {subtitle}
                    </p>
                ) : null}


                { button_text && button_url && (
                    <a 
                        href={button_url || '#'}
                        className={getButtonClasses()}
                    >
                        {button_text || 'Llamada a la acción'}
                    </a>
                )}
                
            </div>
        </section>
    );
};

export default HeroBlock;