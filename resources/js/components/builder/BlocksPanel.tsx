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
        <div className="h-[calc(100vh-150px)] flex flex-col border-r bg-background">
            
            {/* HEADER MÁS COMPACTO */}
            <CardHeader className="py-3 px-4 shrink-0 border-b">
                <CardTitle className="text-sm flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    Bloques
                </CardTitle>
                <CardDescription className="text-[11px]">
                    Click para agregar
                </CardDescription>
            </CardHeader>

            <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                    <div className="p-2 space-y-2">
                        
                        {modules.map((module) => (
                            <button
                                key={module.id}
                                onClick={() => onAddBlock(module)}
                                className="w-50 flex items-center gap-3 p-2 rounded-lg border bg-card hover:bg-muted/50 hover:border-primary/40 transition-all"
                            >
                                {/* ICONO IZQUIERDA */}
                                <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
                                    <Plus className="h-3.5 w-3.5" />
                                </div>

                                {/* TEXTO */}
                                <div className="flex-1 text-left overflow-hidden">
                                    <div className="text-sm font-medium leading-tight truncate">
                                        {module.name}
                                    </div>
                                    <div className="text-[11px] text-muted-foreground truncate">
                                        {module.description}
                                    </div>
                                </div>

                                {/* INDICADOR DERECHA */}
                                <div className="text-xs text-muted-foreground opacity-50">
                                    +
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