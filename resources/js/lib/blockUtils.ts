// lib/blockUtils.ts
import { Component, Block, Module, BlockDefinition } from '@/types/builder';

/**
 * Crea un objeto de valores por defecto para un módulo
 * basado en sus componentes (usa placeholder o vacío)
 */
export function getDefaultValuesForModule(module: Module): Record<string, any> {
    const values: Record<string, any> = {};
    module.components.forEach(comp => {
        if (comp.type === 'toggle') {
            values[comp.name] = false;
        } else if (comp.type === 'select' && comp.options && comp.options.length > 0) {
            values[comp.name] = comp.options[0].value; // primer opción por defecto
        } else if (comp.type === 'external') {
            values[comp.name] = null; // se cargará después
        } else if (comp.type === 'image') {
            values[comp.name] = ''; // URL de la imagen
        } else {
            values[comp.name] = comp.placeholder || '';
        }
    });
    return values;
}

/**
 * Crea un nuevo bloque a partir de un módulo
 */
export const createBlockFromModule = (module: Module, order: number): Block => {
    return {
        order,
        type: 'section',
        module_id: module.id,
        definition_slug: module.slug,
        values: {},
        children: [],
    };
};

export const createBlockFromDefinition = (definition: BlockDefinition, order: number): Block => {
    return {
        order,
        type: 'block',
        block_definition_id: definition.id,
        definition_slug: definition.slug,
        values: {},
        children: definition.is_container ? [] : undefined,
    };
};

/**
 * Agrupa componentes por tipo para renderizado ordenado
 */
export function groupComponentsByType(components: Component[]): Record<string, Component[]> {
    const groups: Record<string, Component[]> = {};
    components.forEach(comp => {
        if (!groups[comp.type]) groups[comp.type] = [];
        groups[comp.type].push(comp);
    });
    return groups;
}