import React from 'react';

interface Props {
    values: Record<string, any>;
    isPreview?: boolean;
    theme?: 'light' | 'dark';
}

const SpacerBlock: React.FC<Props> = ({ values }) => {
    const { height = 40 } = values;
    return <div style={{ height: typeof height === 'number' ? `${height}px` : height }} />;
};

export default SpacerBlock;