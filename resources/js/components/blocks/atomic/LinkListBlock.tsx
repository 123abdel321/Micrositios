import React from 'react';
import { useAppData } from '@/contexts/AppDataContext';

interface Props {
    values: Record<string, any>;
    isPreview?: boolean;
    theme?: 'light' | 'dark';
}

const LinkListBlock: React.FC<Props> = ({ values }) => {
    const { menuItems } = useAppData();
    const { selectedIds = [], orientation = 'vertical' } = values;

    const items = menuItems?.filter(item => selectedIds.includes(item.id)) || [];

    if (items.length === 0) return <p className="text-gray-400 text-sm">Sin enlaces</p>;

    return (
        <ul className={`flex ${orientation === 'vertical' ? 'flex-col space-y-2' : 'flex-row flex-wrap gap-4'}`}>
            {items.map(item => (
                <li key={item.id}>
                    <a href={item.url} target={item.target || '_self'} className="hover:underline">
                        {item.label}
                    </a>
                </li>
            ))}
        </ul>
    );
};

export default LinkListBlock;