// components/builder/PropertiesPanel.tsx
import React from 'react';
import { Block, Module, BlockDefinition } from '@/types/builder';
import BlockEditor from '@/components/blocks/BlockEditor';
import { AlignVerticalDistributeCenter } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    block: Block | null;
    modules: Module[];
    blockDefinitions: BlockDefinition[];
    onBlockChange: (updatedBlock: Block) => void;
}

const PropertiesPanel: React.FC<Props> = ({ block, modules, blockDefinitions, onBlockChange }) => {
    if (!block) {
        return (
            <div className="h-full flex flex-col">
                <CardHeader className="mt-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <AlignVerticalDistributeCenter className="h-5 w-5" />
                        Propiedades
                    </CardTitle>
                    <CardDescription>Selecciona un bloque para editarlo</CardDescription>
                </CardHeader>
            </div>
        );
    }

    let definition;
    if (block.type === 'section') {
        definition = modules.find(m => m.id === block.module_id);
    } else {
        definition = blockDefinitions.find(def => def.id === block.block_definition_id);
    }

    if (!definition) return null;

    return (
        <Card className="overflow-y-auto rounded-none border-l shadow-none">
            <CardHeader className="px-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <AlignVerticalDistributeCenter className="h-5 w-5" />
                    Editando {definition.name}
                </CardTitle>
            </CardHeader>
            <BlockEditor
                block={block}
                definition={definition}
                onChange={(fieldName, value) => {
                    const updatedBlock = {
                        ...block,
                        values: {
                            ...block.values,
                            [fieldName]: value,
                        },
                    };
                    onBlockChange(updatedBlock);
                }}
            />
        </Card>
    );
};

export default PropertiesPanel;