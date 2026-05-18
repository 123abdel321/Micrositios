import React from 'react';
import { Block } from '@/types/builder';
import BlockRenderer from '../BlockRenderer';

interface Props {
    values: Record<string, any>;
    children?: Block[];
    isPreview?: boolean;
    theme?: 'light' | 'dark';
}

const GridBlock: React.FC<Props> = ({ values, children = [], isPreview = false, theme = 'light' }) => {
    const { columns = 2, gap = 4 } = values;
    const gridColsMap = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    } as const;
    const columnsKey: keyof typeof gridColsMap =
        columns === 1 || columns === 2 || columns === 3 || columns === 4 ? columns : 2;
    const gridCols = gridColsMap[columnsKey];

    return (
        <div className={`grid ${gridCols} gap-${gap}`}>
            {children.map((child, idx) => (
                <BlockRenderer key={child.id || idx} block={child} isPreview={isPreview} />
            ))}
        </div>
    );
};

export default GridBlock;