import React from 'react';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import { Block } from '@/types/builder';
import AppearanceToggleTab from '@/components/appearance-toggle-tab';

interface Props {
    landing: { id: number; name: string };
    blocks: Block[];
    isPreview?: boolean;
}

const LandingShow: React.FC<Props> = ({ landing, blocks, isPreview = false }) => {
    return (
        <div className="min-h-screen">
            {/* Botón discreto en la esquina inferior derecha */}
            <div className="fixed bottom-6 right-6 z-50">
                <AppearanceToggleTab />
            </div>

            {blocks.length === 0 ? (
                <div className="flex items-center justify-center h-screen">
                    <p className="text-muted-foreground">No hay bloques configurados para esta landing.</p>
                </div>
            ) : (
                blocks.map((block, index) => (
                    <BlockRenderer
                        key={block.id || index}
                        block={block}
                        isPreview={isPreview}
                    />
                ))
            )}
        </div>
    );
};

export default LandingShow;