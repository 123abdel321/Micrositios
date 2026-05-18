import React from 'react';

interface Props {
    values: Record<string, any>;
    isPreview?: boolean;
    theme?: 'light' | 'dark';
}

const HeadingBlock: React.FC<Props> = ({ values, isPreview = false }) => {
    const { text = 'Título', level = 'h2', alignment = 'left' } = values;
    const headingTag =
        level === 'h1' || level === 'h2' || level === 'h3' || level === 'h4' || level === 'h5' || level === 'h6'
            ? level
            : 'h2';
    const Tag: React.ElementType = headingTag;
    const alignmentClassMap = { left: 'text-left', center: 'text-center', right: 'text-right' } as const;
    const alignmentKey: keyof typeof alignmentClassMap =
        alignment === 'left' || alignment === 'center' || alignment === 'right' ? alignment : 'left';
    const alignmentClass = alignmentClassMap[alignmentKey];

    return <Tag className={`text-2xl font-bold mb-4 ${alignmentClass}`}>{text}</Tag>;
};

export default HeadingBlock;