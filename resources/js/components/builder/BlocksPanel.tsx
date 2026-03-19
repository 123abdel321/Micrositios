import React from 'react';
import { Module } from '@/types/builder';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers, Plus } from 'lucide-react';

interface Props {
    modules: Module[];
    onAddBlock: (module: Module) => void;
}

const BlocksPanel: React.FC<Props> = ({ modules, onAddBlock }) => {
    return (
        // El h-full es vital aquí
        <div className="h-full flex flex-col">
            <CardHeader className="py-5 shrink-0 border-b bg-background/50 backdrop-blur">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    Bloques
                </CardTitle>
                <CardDescription>Haz clic para agregar</CardDescription>
            </CardHeader>
            
            {/* flex-1 junto con min-h-0 permite que el scroll funcione correctamente */}
            <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                    <div className="p-4 space-y-3">
                        {modules.map((module) => (
                            <button
                                key={module.id}
                                onClick={() => onAddBlock(module)}
                                className="w-full text-left p-4 rounded-xl border bg-card hover:border-primary/50 hover:shadow-md transition-all group relative overflow-hidden"
                            >
                                <div className="font-semibold text-sm mb-1">{module.name}</div>
                                <div className="text-xs text-muted-foreground line-clamp-2">
                                    {module.description}
                                </div>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-primary/10 p-1 rounded-full text-primary">
                                        <Plus className="h-4 w-4" />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default BlocksPanel;