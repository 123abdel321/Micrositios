// components/builder/BlocksToolbar.tsx
import React from 'react';
import { Module } from '@/types/builder';
import { Plus } from 'lucide-react';

interface Props {
    modules: Module[];
    onAddBlock: (module: Module) => void;
    isMobile?: boolean;
}

const BlocksToolbar: React.FC<Props> = ({ modules, onAddBlock, isMobile = false }) => {
    const handleAdd = (module: Module) => {
        onAddBlock(module);
    };

    // Versión desktop: barra horizontal con scroll
    if (!isMobile) {
        return (
            <div className="w-full px-2 py-1.5 flex items-center gap-2 overflow-x-auto scrollbar-thin border-b bg-gray-50/80">
                <span className="text-xs font-medium text-gray-500 mr-1 shrink-0">Añadir bloque:</span>
                {modules.map(module => (
                    <button
                        key={module.id}
                        onClick={() => handleAdd(module)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border shadow-sm text-sm hover:bg-gray-50 active:scale-95 transition-all whitespace-nowrap"
                    >
                        <Plus size={14} />
                        {module.name}
                    </button>
                ))}
            </div>
        );
    }

    // Versión móvil: lista vertical simple (ya que está dentro de la pestaña "Bloques")
    return (
        <div className="flex flex-col gap-2 p-3">
            {modules.map(module => (
                <button
                    key={module.id}
                    onClick={() => handleAdd(module)}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-white text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Plus size={16} className="text-gray-600" />
                    </div>
                    <div>
                        <div className="font-medium text-sm">{module.name}</div>
                        {module.description && (
                            <div className="text-xs text-gray-500">{module.description}</div>
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
};

export default BlocksToolbar;