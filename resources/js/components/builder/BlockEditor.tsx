// components/builder/BlockEditor.tsx
import React, { useMemo } from 'react';
import { Block, Module } from '@/types/builder';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
    block: Block;
    modules: Module[]; // todos los módulos para obtener la definición del actual
    onUpdate: (values: Record<string, any>) => void;
}

const BlockEditor: React.FC<Props> = ({ block, modules, onUpdate }) => {
    // Encontrar el módulo al que pertenece este bloque
    const moduleDef = useMemo(() => {
        return modules.find(m => m.id === block.module_id);
    }, [modules, block.module_id]);

    const getInputValue = (value: unknown): string | number | readonly string[] | undefined => {
        if (typeof value === 'string' || typeof value === 'number') {
            return value;
        }

        return '';
    };

    const getSelectValue = (value: unknown): string | undefined => {
        return typeof value === 'string' ? value : undefined;
    };

    if (!moduleDef) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-muted-foreground">Módulo no encontrado</p>
                </CardContent>
            </Card>
        );
    }

    // Ordenar componentes por el campo 'order'
    const sortedComponents = [...moduleDef.components].sort((a, b) => a.order - b.order);

    const handleChange = (fieldName: string, value: any) => {
        const newValues = { ...block.values, [fieldName]: value };
        onUpdate(newValues);
    };

    const renderField = (component: Module['components'][0]) => {
        const value = block.values[component.name] ?? '';

        switch (component.type) {
            case 'text':
            case 'number':
                return (
                    <Input
                        type={component.type}
                        id={component.name}
                        value={getInputValue(value)}
                        onChange={(e) => handleChange(component.name, e.target.value)}
                        placeholder={component.placeholder || ''}
                        required={component.is_required}
                    />
                );

            case 'color':
                return (
                    <div className="flex gap-2">
                        <Input
                            type="color"
                            id={component.name}
                            value={typeof value === 'string' && value ? value : '#000000'}
                            onChange={(e) => handleChange(component.name, e.target.value)}
                            className="w-12 p-1 h-10"
                        />
                        <Input
                            type="text"
                            value={getInputValue(value)}
                            onChange={(e) => handleChange(component.name, e.target.value)}
                            placeholder="#000000"
                            className="flex-1"
                        />
                    </div>
                );

            case 'select':
                return (
                    <Select
                        value={getSelectValue(value)}
                        onValueChange={(val) => handleChange(component.name, val)}
                    >
                        <SelectTrigger id={component.name}>
                            <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                        <SelectContent>
                            {component.options?.map((opt) => (
                                <SelectItem key={opt.id} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'toggle':
                return (
                    <div className="flex items-center space-x-2">
                        <Switch
                            id={component.name}
                            checked={!!value}
                            onCheckedChange={(checked) => handleChange(component.name, checked)}
                        />
                        <Label htmlFor={component.name}>{component.label}</Label>
                    </div>
                );

            case 'image':
                return (
                    <div className="space-y-2">
                        <Input
                            type="url"
                            id={component.name}
                            value={getInputValue(value)}
                            onChange={(e) => handleChange(component.name, e.target.value)}
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                        {typeof value === 'string' && value && (
                            <img
                                src={value}
                                alt="Preview"
                                className="max-w-full h-32 object-cover rounded border"
                            />
                        )}
                    </div>
                );

            case 'external':
                return (
                    <div className="text-sm text-muted-foreground border p-2 rounded bg-muted/50">
                        <p className="font-medium">Datos desde fuente externa:</p>
                        <p className="text-xs truncate">{component.data_source}</p>
                        {value && (
                            <pre className="mt-2 text-xs bg-background p-2 rounded max-h-40 overflow-auto">
                                {JSON.stringify(value, null, 2)}
                            </pre>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };
}

export default BlockEditor;