// components/builder/AvailableModules.tsx
import React from 'react';
import { Module } from '@/types/builder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    modules: Module[];
    onAdd: (moduleId: number) => void;
}

const AvailableModules: React.FC<Props> = ({ modules, onAdd }) => {
    return (
        <div className="space-y-3">
            {modules.map((module) => (
                <Card key={module.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => onAdd(module.id)}>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm">{module.name}</CardTitle>
                        <CardDescription className="text-xs line-clamp-2">
                            {module.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <Button variant="ghost" size="sm" className="w-full text-xs">
                            Agregar bloque
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default AvailableModules;