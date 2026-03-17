// components/builder/BlocksPanel.tsx
import React from 'react';
import { Module } from '@/types/builder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {
    modules: Module[];
    onAddBlock: (module: Module) => void;
}

const BlocksPanel: React.FC<Props> = ({ modules, onAddBlock }) => {
    return (
        <Card className="h-full rounded-none border-r">
            <CardHeader>
                <CardTitle>Bloques disponibles</CardTitle>
                <CardDescription>
                    Arrastra o haz clic para agregar
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="space-y-2">
                        {modules.map((module) => (
                            <Button
                                key={module.id}
                                variant="outline"
                                className="w-full justify-start text-left"
                                onClick={() => onAddBlock(module)}
                            >
                                <div>
                                    <div className="font-medium">{module.name}</div>
                                    <div className="text-xs text-muted-foreground truncate">
                                        {module.description}
                                    </div>
                                </div>
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default BlocksPanel;