import React from 'react';
import { Module } from '@/types/builder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers } from 'lucide-react';

interface Props {
    modules: Module[];
    onAddBlock: (module: Module) => void;
}

const BlocksPanel: React.FC<Props> = ({ modules, onAddBlock }) => {
    return (
        <div className="h-full flex flex-col">
            <CardHeader className="mt-5">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Bloques disponibles
                </CardTitle>
                <CardDescription>
                    Arrastra o haz clic para agregar
                </CardDescription>
            </CardHeader>
            <CardContent className="p-3">
                <ScrollArea className="h-[calc(100vh-200px)] pr-2">
                    <div className="space-y-2">
                        {modules.map((module) => (
                            <button
                                key={module.id}
                                onClick={() => onAddBlock(module)}
                                className="w-full text-left p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
                            >
                                <div className="font-medium text-sm">{module.name}</div>
                                <div className="text-xs text-muted-foreground line-clamp-2">
                                    {module.description}
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </div>
    );
};

export default BlocksPanel;