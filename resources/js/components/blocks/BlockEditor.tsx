// components/blocks/BlockEditor.tsx
import React from 'react';
import { Block, Module, Component } from '@/types/builder';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    block: Block;
    module: Module; // el módulo completo con sus componentes
    onChange: (fieldName: string, value: any) => void;
}

const BlockEditor: React.FC<Props> = ({ block, module, onChange }) => {

    const sortedComponents = [...module.components].sort((a, b) => a.order - b.order);

    const toInputValue = (v: unknown): string | number => {
        if (typeof v === 'string' || typeof v === 'number') return v;
        return '';
    };

    const toSelectValue = (v: unknown): string | undefined => {
        return typeof v === 'string' ? v : undefined;
    };

    const renderField = (component: Component) => {
        const value = block.values[component.name] ?? '';

        switch (component.type) {
            case 'text':
            case 'number':
                return (
                    <Input
                        type={component.type}
                        id={component.name}
                        value={toInputValue(value)}
                        onChange={(e) => onChange(component.name, e.target.value)}
                        placeholder={component.placeholder || undefined}
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
                            onChange={(e) => onChange(component.name, e.target.value)}
                            className="w-12 p-1 h-10"
                        />
                        <Input
                            type="text"
                            value={toInputValue(value)}
                            onChange={(e) => onChange(component.name, e.target.value)}
                            placeholder="#000000"
                            className="flex-1"
                        />
                    </div>
                );

            case 'select':
                return (
                    <Select
                        value={toSelectValue(value)}
                        onValueChange={(val) => onChange(component.name, val)}
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
                            onCheckedChange={(checked) => onChange(component.name, checked)}
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
                            value={toInputValue(value)}
                            onChange={(e) => onChange(component.name, e.target.value)}
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
                        Datos cargados desde fuente externa: {component.data_source}
                        {value && <pre className="mt-1 text-xs">{JSON.stringify(value, null, 2)}</pre>}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div>
            <CardContent className="space-y-4">
                {sortedComponents.map((comp) => (
                    <div key={comp.id} className="space-y-1">
                        <Label htmlFor={comp.name}>
                            {comp.label}
                            {comp.is_required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {renderField(comp)}
                        {comp.validation_rules && (
                            <p className="text-xs text-muted-foreground">
                                Reglas: {comp.validation_rules.join(', ')}
                            </p>
                        )}
                    </div>
                ))}
            </CardContent>
        </div>
    );
};

export default BlockEditor;