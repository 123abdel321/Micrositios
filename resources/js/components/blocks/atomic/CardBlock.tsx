import React from 'react';
import { Block } from '@/types/builder';
import BlockRenderer from '../BlockRenderer';

interface Props {
    values: Record<string, any>;
    children?: Block[];
    isPreview?: boolean;
    theme?: 'light' | 'dark';
}

const CardBlock: React.FC<Props> = ({ values, children = [], isPreview = false, theme = 'light' }) => {
    const { padding = 'md', border = true, shadow = 'md' } = values;

    const paddingClassMap = { sm: 'p-3', md: 'p-4', lg: 'p-6' } as const;
    const shadowClassMap = { none: '', sm: 'shadow-sm', md: 'shadow-md', lg: 'shadow-lg' } as const;
    const paddingKey: keyof typeof paddingClassMap =
        padding === 'sm' || padding === 'md' || padding === 'lg' ? padding : 'md';
    const shadowKey: keyof typeof shadowClassMap =
        shadow === 'none' || shadow === 'sm' || shadow === 'md' || shadow === 'lg' ? shadow : 'md';
    const paddingClasses = paddingClassMap[paddingKey];
    const shadowClasses = shadowClassMap[shadowKey];

    return (
        <div className={`bg-white ${border ? 'border' : ''} rounded-lg ${shadowClasses} ${paddingClasses}`}>
            {children.map((child, idx) => (
                <BlockRenderer key={child.id || idx} block={child} isPreview={isPreview} />
            ))}
        </div>
    );
};

export default CardBlock;