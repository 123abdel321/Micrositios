import React from 'react';
import { useAppearance } from '@/hooks/use-appearance';
import { Block } from '@/types/builder';
// Secciones existentes
import HeaderBlock from '@/components/blocks/HeaderBlock';
import HeroBlock from '@/components/blocks/HeroBlock';
import HeroSplitBlock from '@/components/blocks/HeroSplitBlock';
import FooterBlock from '@/components/blocks/FooterBlock';
// Bloques atómicos
import ButtonBlock from './atomic/ButtonBlock';
import HeadingBlock from './atomic/HeadingBlock';
import TextBlock from './atomic/TextBlock';
import ImageBlock from './atomic/ImageBlock';
import SpacerBlock from './atomic/SpacerBlock';
import LinkListBlock from './atomic/LinkListBlock';
import GridBlock from './atomic/GridBlock';
import CardBlock from './atomic/CardBlock';

'./atomic/ButtonBlock';

interface Props {
    block: Block;
    isPreview?: boolean;
}

const BlockRenderer: React.FC<Props> = ({ block, isPreview = false }) => {
    const { appearance } = useAppearance();
    const effectiveTheme: 'light' | 'dark' = appearance === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : appearance;

    const slug = block.definition_slug;

    // Secciones
    if (slug === 'header') return <HeaderBlock values={block.values} isPreview={isPreview} theme={effectiveTheme} />;
    if (slug === 'hero') return <HeroBlock values={block.values} isPreview={isPreview} theme={effectiveTheme} />;
    if (slug === 'hero-split') return <HeroSplitBlock values={block.values} isPreview={isPreview} theme={effectiveTheme} />;
    if (slug === 'footer') return <FooterBlock values={block.values} isPreview={isPreview} theme={effectiveTheme} />;

    // Bloques atómicos
    if (slug === 'button') return <ButtonBlock values={block.values} isPreview={isPreview} theme={effectiveTheme} />;
    if (slug === 'heading') return <HeadingBlock values={block.values} isPreview={isPreview} theme={effectiveTheme} />;
    if (slug === 'text') return <TextBlock values={block.values} isPreview={isPreview} theme={effectiveTheme} />;
    if (slug === 'image') return <ImageBlock values={block.values} isPreview={isPreview} theme={effectiveTheme} />;
    if (slug === 'spacer') return <SpacerBlock values={block.values} isPreview={isPreview} theme={effectiveTheme} />;
    if (slug === 'link_list') return <LinkListBlock values={block.values} isPreview={isPreview} theme={effectiveTheme} />;
    if (slug === 'grid') return <GridBlock values={block.values} children={block.children} isPreview={isPreview} theme={effectiveTheme} />;
    if (slug === 'card') return <CardBlock values={block.values} children={block.children} isPreview={isPreview} theme={effectiveTheme} />;

    return (
        <div className="p-4 border border-dashed border-gray-300 rounded-lg text-gray-500">
            Bloque desconocido: {slug}
        </div>
    );
};

export default BlockRenderer;