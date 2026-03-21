// components/blocks/BlockEditor.tsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Block, Module, Component } from '@/types/builder';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface Props {
    block: Block;
    module: Module;
    onChange: (fieldName: string, value: any) => void;
}

const BlockEditor: React.FC<Props> = ({ block, module, onChange }) => {
    // Memoizar los componentes ordenados para evitar recreaciones
    const sortedComponents = React.useMemo(
        () => [...module.components].sort((a, b) => a.order - b.order),
        [module.components]
    );
    
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
    const [errorStates, setErrorStates] = useState<Record<string, string>>({});
    const fetchedRef = useRef<Set<string>>(new Set()); // Para trackear qué ya se cargó

    const toInputValue = (v: unknown): string | number => {
        if (typeof v === 'string' || typeof v === 'number') return v;
        return '';
    };

    // Función para cargar datos externos con useCallback
    const fetchExternalData = useCallback(async (component: Component) => {

        if (!component.data_source) return;

        // Si ya se cargó antes, no cargar de nuevo
        const fetchKey = `${component.id}-${component.name}`;
        if (fetchedRef.current.has(fetchKey)) {
            return;
        }

        // Si ya tiene valor, marcar como cargado y no recargar
        const currentValue = block.values[component.name];
        if (currentValue && (Array.isArray(currentValue) && currentValue.length > 0) || 
            (typeof currentValue === 'object' && currentValue !== null && Object.keys(currentValue).length > 0)) {
            fetchedRef.current.add(fetchKey);
            return;
        }

        setLoadingStates(prev => ({ ...prev, [component.name]: true }));
        setErrorStates(prev => ({ ...prev, [component.name]: '' }));

        try {
            const baseUrl = import.meta.env.VITE_API_URL || '';
            const url = `${baseUrl}${component.data_source}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Marcar como cargado antes de actualizar
            fetchedRef.current.add(fetchKey);
            
            // Actualizar el valor en el bloque
            onChange(component.name, data);
            
        } catch (error) {
            setErrorStates(prev => ({ 
                ...prev, 
                [component.name]: error instanceof Error ? error.message : 'Error al cargar datos' 
            }));
        } finally {
            setLoadingStates(prev => ({ ...prev, [component.name]: false }));
        }
    }, [block.values, onChange]);

    // Cargar datos externos UNA SOLA VEZ cuando el componente se monta
    useEffect(() => {
        // Usar un flag para evitar ejecuciones múltiples
        let isMounted = true;
        
        const loadExternalData = async () => {
            for (const component of sortedComponents) {
                if (component.type === 'external' && component.data_source && isMounted) {
                    await fetchExternalData(component);
                }
            }
        };
        
        loadExternalData();
        
        return () => {
            isMounted = false;
        };
    }, [sortedComponents, fetchExternalData]); // Solo dependencias estables

    const renderField = (component: Component) => {
        const value = block.values[component.name] ?? '';
        const isLoading = loadingStates[component.name];
        const error = errorStates[component.name];

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
                        value={value ? String(value) : ""}
                        onValueChange={(val) => onChange(component.name, val)}
                    >
                        <SelectTrigger id={component.name} className="w-full">
                            <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>

                        <SelectContent
                            position="popper"
                            className="z-[9999] max-h-60 overflow-y-auto"
                        >
                            {Array.isArray(component.options) &&
                                component.options.map((opt) => (
                                    <SelectItem
                                        key={opt.id}
                                        value={String(opt.value)}
                                    >
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
                            placeholder={component.placeholder || "https://example.com/image.jpg"}
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
                    <div className="text-sm border rounded bg-muted/50">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                <span>Cargando datos...</span>
                            </div>
                        ) : error ? (
                            <div className="p-4 text-red-500">
                                <p className="font-semibold">Error al cargar datos</p>
                                <p className="text-xs">{error}</p>
                                <button 
                                    onClick={() => {
                                        // Limpiar el flag para permitir reintentar
                                        const fetchKey = `${component.id}-${component.name}`;
                                        fetchedRef.current.delete(fetchKey);
                                        fetchExternalData(component);
                                    }}
                                    className="mt-2 text-xs underline hover:no-underline"
                                >
                                    Reintentar
                                </button>
                            </div>
                        ) : (
                            <div className="p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-muted-foreground text-xs">
                                        Fuente: {component.data_source}
                                    </span>
                                    <button 
                                        onClick={() => {
                                            // Limpiar el flag para permitir recargar
                                            const fetchKey = `${component.id}-${component.name}`;
                                            fetchedRef.current.delete(fetchKey);
                                            fetchExternalData(component);
                                        }}
                                        className="text-xs text-primary hover:underline"
                                    >
                                        Actualizar
                                    </button>
                                </div>
                                {value && Array.isArray(value) && value.length > 0 ? (
                                    <div className="space-y-2">
                                        <p className="text-xs font-medium">
                                            {value.length} elemento(s) cargado(s)
                                        </p>
                                        <pre className="text-xs overflow-auto max-h-40 p-2 bg-muted rounded">
                                            {JSON.stringify(value, null, 2)}
                                        </pre>
                                    </div>
                                ) : value && typeof value === 'object' ? (
                                    <pre className="text-xs overflow-auto max-h-40 p-2 bg-muted rounded">
                                        {JSON.stringify(value, null, 2)}
                                    </pre>
                                ) : (
                                    <p className="text-muted-foreground text-xs italic">
                                        No hay datos cargados. Haz clic en "Actualizar" para cargar.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                );

            case 'range': {
                const options = component.configuration as any || { min: 0, max: 100, step: 1, unit: '' };
                const config = typeof options === 'string' ? JSON.parse(options) : options;

                return (
                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <Input
                                type="range"
                                id={component.name}
                                min={config.min}
                                max={config.max}
                                step={config.step}
                                value={Number(value) || config.min}
                                onChange={(e) => onChange(component.name, Number(e.target.value))}
                                className="flex-1"
                            />
                            <span className="text-sm font-mono min-w-[60px]">
                                {value}{config.unit}
                            </span>
                        </div>
                    </div>
                );
            }

            default:
                return null;
        }
    };

    return (
        <div>
            <CardContent className="h-[calc(100vh-120px)] overflow-y-auto space-y-4 custom-scrollbar">
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