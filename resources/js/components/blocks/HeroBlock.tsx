import React, { useEffect, useRef, useState } from 'react';

interface Props {
    values: Record<string, any>;
    isPreview?: boolean;
    theme?: 'light' | 'dark';
}

const HeroBlock: React.FC<Props> = ({ values, isPreview = false, theme = 'light' }) => {
    const heroRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

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
        button_style = 'primary',
        // Nuevos campos (opcionales)
        overlay_opacity = 0,
        scroll_animation = false,
        button2_text = '',
        button2_url = '',
        button2_style = 'outline'
    } = values;

    // Detectar visibilidad para animación al scroll
    useEffect(() => {
        if (!scroll_animation || isPreview) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        if (heroRef.current) observer.observe(heroRef.current);
        return () => observer.disconnect();
    }, [scroll_animation, isPreview]);

    // Estilos principales del hero
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
        display: 'flex',
        alignItems: 'center',
    };

    // Overlay si existe opacidad
    const overlayStyle: React.CSSProperties = overlay_opacity > 0 ? {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: `rgba(0, 0, 0, ${overlay_opacity / 100})`,
        zIndex: 1,
    } : {};

    const getButtonClasses = (style: string = button_style, isSecond: boolean = false) => {
        const baseClasses = "inline-block px-6 py-3 rounded-md transition-all duration-300 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5";
        switch (style) {
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

    // Clases de animación
    const animationClass = scroll_animation && !isPreview
        ? `transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`
        : '';

    return (
        <section ref={heroRef} style={heroStyle} className="relative overflow-hidden">
            {/* Overlay */}
            {overlay_opacity > 0 && <div style={overlayStyle} />}

            {/* Preview badge */}
            {isPreview && (
                <div className="text-xs opacity-60 bg-black/50 text-white px-2 py-1 rounded absolute bottom-2 left-2 z-50">
                    [Hero]
                </div>
            )}

            {/* Contenido */}
            <div className="container mx-auto px-4 relative z-10 w-full">
                <div className={`max-w-4xl mx-auto flex flex-col justify-center ${getAlignmentClass()} ${animationClass}`}>
                    {title && (
                        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 leading-tight">
                            {title}
                        </h1>
                    )}
                    
                    {subtitle && (
                        <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl opacity-90 leading-relaxed">
                            {subtitle}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-4 justify-center items-center">
                        {button_text && button_url && (
                            <a 
                                href={button_url || '#'}
                                className={getButtonClasses()}
                                target={button_url?.startsWith('http') ? '_blank' : '_self'}
                                rel={button_url?.startsWith('http') ? 'noopener noreferrer' : ''}
                            >
                                {button_text}
                            </a>
                        )}
                        {button2_text && button2_url && (
                            <a 
                                href={button2_url || '#'}
                                className={getButtonClasses(button2_style, true)}
                                target={button2_url?.startsWith('http') ? '_blank' : '_self'}
                                rel={button2_url?.startsWith('http') ? 'noopener noreferrer' : ''}
                            >
                                {button2_text}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Decoración opcional (ola o curva inferior) - puedes añadirla como campo más adelante */}
            {/* <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="currentColor" fillOpacity="0.1"></path>
                </svg>
            </div> */}
        </section>
    );
};

export default HeroBlock;