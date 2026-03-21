// components/blocks/BlockRenderer.tsx
import React, { useEffect, useState } from 'react';
import { useAppearance } from '@/hooks/use-appearance';
import { Block } from '@/types/builder';
import HeaderBlock from '@/components/blocks/HeaderBlock';
import HeroBlock from '@/components/blocks/HeroBlock';
import FooterBlock from '@/components/blocks/FooterBlock';

interface Props {
    block: Block;
    isPreview?: boolean;
}

const BlockRenderer: React.FC<Props> = ({ block, isPreview = false }) => {
    const { appearance } = useAppearance(); // 'light' | 'dark' | 'system'
    const effectiveTheme: 'light' | 'dark' = appearance === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : appearance;

    // Pasamos effectiveTheme a los bloques que lo necesiten
    switch (block.module_slug) {
        case 'header':
            return (
                <HeaderBlock
                    values={block.values}
                    isPreview={isPreview}
                    theme={effectiveTheme}
                />
            );
        case 'hero':
            return (
                <HeroBlock
                    values={block.values}
                    isPreview={isPreview}
                    theme={effectiveTheme}
                />
            );
        case 'footer':
            return (
                <FooterBlock
                    values={block.values}
                    isPreview={isPreview}
                    theme={effectiveTheme}
                />
            );
        default:
            return (
                <div className="p-4 border border-dashed border-gray-300 rounded-lg text-gray-500">
                    Bloque desconocido: {JSON.stringify(block)}
                </div>
            );
    }
};

export default BlockRenderer;