import React from 'react';
import { BlockDefinition, Module } from '@/types/builder';
import { Plus } from 'lucide-react';

interface Props {
    modules: Module[];
    blockDefinitions: BlockDefinition[];
    onAddSection: (module: Module) => void;
    onAddBlock: (definition: BlockDefinition, parentId?: number) => void;
    isMobile?: boolean;
}

const BlocksToolbar: React.FC<Props> = ({ modules, blockDefinitions, onAddSection, onAddBlock, isMobile }) => {
    // ... implementación similar a la actual pero separando secciones y bloques
    return (
        <div className="w-full px-2 py-1.5 flex flex-wrap gap-2 overflow-x-auto">
            <span className="text-xs font-medium text-gray-500 mr-1 shrink-0">Secciones:</span>
            {modules.map(module => (
                <button key={module.id} onClick={() => onAddSection(module)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border shadow-sm text-sm hover:bg-gray-50">
                    <Plus size={14} /> {module.name}
                </button>
            ))}
            <span className="text-xs font-medium text-gray-500 ml-2 shrink-0">Bloques:</span>
            {blockDefinitions.map(def => (
                <button key={def.id} onClick={() => onAddBlock(def)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border shadow-sm text-sm hover:bg-gray-50">
                    <Plus size={14} /> {def.name}
                </button>
            ))}
        </div>
    );
};

export default BlocksToolbar;