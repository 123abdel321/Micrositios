import React from 'react';

interface Props {
    values: Record<string, any>;
    isPreview?: boolean;
    theme?: 'light' | 'dark';
}

const HeroSplitBlock: React.FC<Props> = ({ values, isPreview = false, theme = 'light' }) => {
    // Colores según tema
    const bgColor = theme === 'dark' ? values.bg_color_dark : values.bg_color_light;
    const textColor = theme === 'dark' ? values.text_color_dark : values.text_color_light;

    // Valores del componente
    const {
        title,
        description,
        image_url,
        image_alt = '',
        image_fit = 'cover',
        image_position = 'right',   // ← nueva opción: 'left' o 'right'
        image_border_radius = 12,
        image_width_percent = 50,
        button_text,
        button_url,
        button_style = 'primary',
        padding_top = 60,
        padding_bottom = 60,
        padding_left = 40,
        padding_right = 40,
        gap = 48,
        content_vertical_alignment = 'center',
    } = values;

    // Debug: muestra el valor en consola (elimina después)
    console.log('image_fit:', image_fit, 'image_position:', image_position);

    const px = (v: any) => (typeof v === 'number' ? `${v}px` : `${parseInt(v, 10)}px`);

    const getButtonClasses = () => {
        const base = 'inline-block px-7 py-3 rounded-lg font-semibold transition-all duration-200 text-sm tracking-wide';
        switch (button_style) {
            case 'secondary':
                return `${base} bg-secondary text-secondary-foreground hover:bg-secondary/80`;
            case 'outline':
                return `${base} border-2 border-current bg-transparent hover:bg-current/10`;
            default:
                return `${base} bg-primary text-primary-foreground hover:bg-primary/85 shadow-md hover:shadow-lg`;
        }
    };

    const verticalAlign =
        content_vertical_alignment === 'top'
            ? 'flex-start'
            : content_vertical_alignment === 'bottom'
              ? 'flex-end'
              : 'center';

    // Mapeo de object-fit
    const getObjectFit = (fit: string): React.CSSProperties['objectFit'] => {
        switch (fit) {
            case 'cover': return 'cover';
            case 'contain': return 'contain';
            case 'fill': return 'fill';
            case 'none': return 'initial';
            default: return 'cover';
        }
    };

    // Estilos base
    const sectionStyle: React.CSSProperties = {
        backgroundColor: bgColor || undefined,
        color: textColor || undefined,
        paddingTop: px(padding_top),
        paddingBottom: px(padding_bottom),
        paddingLeft: px(padding_left),
        paddingRight: px(padding_right),
        position: 'relative',
    };

    const innerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        gap: px(gap),
        width: '100%',
        margin: '0 auto',
    };

    // Columna de texto (siempre ocupa el resto del ancho)
    const textColStyle: React.CSSProperties = {
        flex: `1 1 ${100 - Number(image_width_percent)}%`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    };

    // Columna de imagen: altura fija para que object-fit funcione
    const imageColStyle: React.CSSProperties = {
        flex: `0 0 ${image_width_percent}%`,
        maxWidth: `${image_width_percent}%`,
        height: '400px',               // altura fija profesional
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: px(image_border_radius),
    };

    const imageStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        objectFit: getObjectFit(image_fit),
        display: 'block',
    };

    // Determinar orden de columnas según image_position
    const isImageLeft = image_position === 'left';

    return (
        <section style={sectionStyle} className="relative overflow-hidden">
            {isPreview && (
                <div
                    className="text-xs opacity-60 bg-black/50 text-white px-2 py-1 rounded"
                    style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 50 }}
                >
                    [HeroSplit]
                </div>
            )}
            <div style={innerStyle}>
                {isImageLeft ? (
                    <>
                        {/* Imagen a la izquierda */}
                        {image_url && (
                            <div style={imageColStyle}>
                                <img src={image_url} alt={image_alt} style={imageStyle} />
                            </div>
                        )}
                        {/* Texto a la derecha */}
                        <div style={textColStyle}>
                            {title && <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">{title}</h2>}
                            {description && <p className="text-lg md:text-xl leading-relaxed opacity-80 max-w-xl">{description}</p>}
                            {button_text && button_url && (
                                <div className="mt-8">
                                    <a href={button_url} className={getButtonClasses()}>{button_text}</a>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Texto a la izquierda */}
                        <div style={textColStyle}>
                            {title && <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">{title}</h2>}
                            {description && <p className="text-lg md:text-xl leading-relaxed opacity-80 max-w-xl">{description}</p>}
                            {button_text && button_url && (
                                <div className="mt-8">
                                    <a href={button_url} className={getButtonClasses()}>{button_text}</a>
                                </div>
                            )}
                        </div>
                        {/* Imagen a la derecha */}
                        {image_url && (
                            <div style={imageColStyle}>
                                <img src={image_url} alt={image_alt} style={imageStyle} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default HeroSplitBlock;