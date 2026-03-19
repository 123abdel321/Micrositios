// components/builder/PropertiesPanel.tsx
import React from 'react';
import { Block, Module } from '@/types/builder';
import BlockEditor from '@/components/blocks/BlockEditor';
import { AlignVerticalDistributeCenter  } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    block: Block | null;
    moduleMap: Map<number, Module>;
    onBlockChange: (updatedBlock: Block) => void;
}

const PropertiesPanel: React.FC<Props> = ({ block, moduleMap, onBlockChange }) => {

    if (!block) {
        return (
            <div className="h-full flex flex-col">
                <CardHeader className="mt-4">

                    <CardTitle className="text-lg flex items-center gap-2">
                        <AlignVerticalDistributeCenter  className="h-5 w-5" />
                        Propiedades
                    </CardTitle>

                    <CardDescription>
                        Selecciona un bloque para editarlo
                    </CardDescription>
                </CardHeader>
            </div>
        );
    }

    const module = moduleMap.get(block.module_id);
    if (!module) return null;

    return (
        <Card className="h-windows rounded-none border-l shadow-none">
            <CardHeader className="px-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <AlignVerticalDistributeCenter  className="h-5 w-5" />
                    Editando {module.name}
                </CardTitle>
            </CardHeader>
            <BlockEditor
                block={block}
                module={module}
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