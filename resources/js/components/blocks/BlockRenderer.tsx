// components/blocks/BlockRenderer.tsx
import React from 'react';
import { Block } from '@/types/builder';
import HeaderBlock from '@/components/blocks/HeaderBlock';
import HeroBlock from '@/components/blocks/HeroBlock';
import FooterBlock from '@/components/blocks/FooterBlock';

interface Props {
    block: Block;
    isPreview?: boolean; // si es vista previa en el editor (sin interactividad)
}

const BlockRenderer: React.FC<Props> = ({ block, isPreview = false }) => {
    switch (block.module_slug) {
        case 'header':
            return <HeaderBlock values={block.values} isPreview={isPreview} />;
        case 'hero':
            return <HeroBlock values={block.values} isPreview={isPreview} />;
        case 'footer':
            return <FooterBlock values={block.values} isPreview={isPreview} />;
        default:
            return (
                <div className="p-4 border border-dashed border-gray-300 rounded-lg text-gray-500">
                    Bloque desconocido: {JSON.stringify(block)}
                </div>
            );
    }
};

export default BlockRenderer;