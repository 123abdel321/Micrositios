// components/builder/BlockEditor.tsx
import React, { useMemo } from 'react';
import { Block, Module } from '@/types/builder';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
    block: Block;
    modules: Module[]; // todos los módulos para obtener la definición del actual
    onUpdate: (values: Record<string, any>) => void;
}

const BlockEditor: React.FC<Props> = ({ block, modules, onUpdate }) => {
    // Encontrar el módulo al que pertenece este bloque
    const moduleDef = useMemo(() => {
        return modules.find(m => m.id === block.module_id);
    }, [modules, block.module_id]);

    if (!moduleDef) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-muted-foreground">Módulo no encontrado</p>
                </CardContent>
            </Card>
        );
    }
}

export default BlockEditor;