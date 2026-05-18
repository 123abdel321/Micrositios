// types/builder.ts
export type BlockValue = string | number | boolean | null | Record<string, any>;
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
    configuration: Record<string, unknown> | string | null;
    depends_on: string | null;
    field_group: string | null;
    options?: ComponentOption[];
}

export interface Module {
    id: number;
    name: string;
    description: string;
    slug: string;
    components: Component[];
}

export interface BlockDefinition {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string | null;
    is_container: boolean;
    max_children: number | null;
    components: Component[];
}

export interface Block {
    id?: number;
    order: number;
    type: 'section' | 'block';
    module_id?: number;       // solo para secciones
    block_definition_id?: number; // solo para bloques
    parent_id?: number | null;
    children?: Block[];
    values: BlockValues;
    module_slug: string; // para facilitar acceso a los componentes, se llena al cargar el landing
    definition_slug?: string; // slug del módulo o block_definition
    // Datos de UI
    _isNew?: boolean;
}

export interface Landing {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
    is_principal: boolean;
    user_id: number;
    blocks: Block[];      // raíces (parent_id = null)
    created_at: string;
    updated_at: string;
}