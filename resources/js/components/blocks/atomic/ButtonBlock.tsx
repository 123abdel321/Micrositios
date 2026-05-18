import React from 'react';

interface Props {
    values: Record<string, any>;
    isPreview?: boolean;
    theme?: 'light' | 'dark';
}

const ButtonBlock: React.FC<Props> = ({ values, isPreview = false, theme = 'light' }) => {
    const { text = 'Botón', url = '#', style = 'primary', target = '_self' } = values;

    const getButtonClasses = () => {
        const base = "inline-block px-6 py-3 rounded-md transition-all duration-300 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5";
        switch (style) {
            case 'secondary': return `${base} bg-gray-600 text-white hover:bg-gray-700`;
            case 'outline': return `${base} border-2 border-current bg-transparent hover:bg-current hover:text-background`;
            default: return `${base} bg-blue-600 text-white hover:bg-blue-700`;
        }
    };

    return (
        <div className={isPreview ? "pointer-events-none" : ""}>
            <a href={url} target={target} rel={target === '_blank' ? 'noopener noreferrer' : ''} className={getButtonClasses()}>
                {text}
            </a>
        </div>
    );
};

export default ButtonBlock;