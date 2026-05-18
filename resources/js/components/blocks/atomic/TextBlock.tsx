import React from 'react';

interface Props {
    values: Record<string, any>;
    isPreview?: boolean;
    theme?: 'light' | 'dark';
}

type Alignment = 'left' | 'center' | 'right';

const ALIGNMENT_CLASSES: Record<Alignment, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
};

const TextBlock: React.FC<Props> = ({ values, isPreview = false, theme = 'light' }) => {
    const { content = 'Texto de ejemplo...', alignment = 'left' as Alignment } = values;
        const alignmentClassMap = { left: 'text-left', center: 'text-center', right: 'text-right' } as const;
        const alignmentKey: keyof typeof alignmentClassMap =
            alignment === 'left' || alignment === 'center' || alignment === 'right' ? alignment : 'left';
        const alignmentClass = alignmentClassMap[alignmentKey];

    return <p className={`text-base leading-relaxed ${alignmentClass}`}>{content}</p>;
};

export default TextBlock;