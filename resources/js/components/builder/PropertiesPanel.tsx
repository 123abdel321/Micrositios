// components/builder/PropertiesPanel.tsx
import React from 'react';
import { Block, Module } from '@/types/builder';
import BlockEditor from '@/components/blocks/BlockEditor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {
    block: Block | null;
    moduleMap: Map<number, Module>; // para obtener el módulo rápido
    onBlockChange: (updatedBlock: Block) => void;
}

const PropertiesPanel: React.FC<Props> = ({ block, moduleMap, onBlockChange }) => {
    if (!block) {
        return (
            <Card className="h-full rounded-none border-l">
                <CardHeader>
                    <CardTitle>Propiedades</CardTitle>
                    <CardDescription>
                        Selecciona un bloque para editarlo
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const module = moduleMap.get(block.module_id);
    if (!module) return null;

    const handleFieldChange = (fieldName: string, value: any) => {
        const updatedBlock = {
            ...block,
            values: {
                ...block.values,
                [fieldName]: value,
            },
        };
        onBlockChange(updatedBlock);
    };

    return (
        <Card className="h-full rounded-none border-l">
            <CardHeader>
                <CardTitle>Editar {module.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                    <BlockEditor
                        block={block}
                        module={module}
                        onChange={handleFieldChange}
                    />
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default PropertiesPanel;