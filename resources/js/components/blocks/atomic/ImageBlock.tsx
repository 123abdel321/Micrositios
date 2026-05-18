import React from 'react';

interface Props {
    values: Record<string, any>;
    isPreview?: boolean;
    theme?: 'light' | 'dark';
}

const ImageBlock: React.FC<Props> = ({ values }) => {
    const { url, alt = '', width = 'auto', height = 'auto', rounded = 'none' } = values;
    if (!url) return <div className="bg-gray-200 p-4 text-center text-gray-500">Sin imagen</div>;

    const roundedClassMap = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full'
    } as const;
    const roundedKey: keyof typeof roundedClassMap =
        rounded === 'none' || rounded === 'sm' || rounded === 'md' || rounded === 'lg' || rounded === 'full'
            ? rounded
            : 'md';
    const roundedClass = roundedClassMap[roundedKey];

    return <img src={url} alt={alt} className={`max-w-full h-auto ${roundedClass}`} style={{ width, height }} />;
};

export default ImageBlock;