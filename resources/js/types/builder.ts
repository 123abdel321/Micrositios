// types/builder.ts
export type BlockValue = string | number | boolean | null;
export type BlockValues = Record<string, BlockValue>;

export interface ComponentOption {
    id: number;
    label: string;
    value: string;
    order: number;
}

export interface Component {
    id: number;
    module_id: number;
    label: string;
    name: string;
    type: 'text' | 'number' | 'select' | 'color' | 'image' | 'range' | 'toggle' | 'external';
    placeholder: string | null;
    is_required: boolean;
    order: number;
    validation_rules: string[] | null;
    data_source: string | null;
    options?: ComponentOption[];
}

export interface Module {
    id: number;
    name: string;
    description: string;
    slug: string;
    components: Component[];
}

export interface Block {
    id?: number;
    order: number;
    module_id: number;
    module_slug: string;
    module_name?: string;
    values: BlockValues;
}

export interface Landing {
    id: number;
    name: string;
    slug: string;
    user_id: number;
    blocks: Block[];
    created_at: string;
    updated_at: string;
}