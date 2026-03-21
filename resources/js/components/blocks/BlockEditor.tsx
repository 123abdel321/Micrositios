import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Block, Module, Component } from '@/types/builder';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';

interface Props {
    block: Block;
    module: Module;
    onChange: (fieldName: string, value: any) => void;
}

// Componente SelectField separado para manejar su propio estado
// Componente SelectField con caché usando useAppData
const SelectField: React.FC<{
    component: Component;
    value: any;
    onChange: (value: any) => void;
}> = ({ component, value, onChange }) => {
    // Importar useAppData
    const { getCachedData, setCachedData, isLoading: isGlobalLoading, setIsLoading } = useAppData();
    
    const config = component.configuration as any || {};
    const options = config.options || [];
    const isMultiple = config.is_multiple || false;
    const maxSelections = config.max_selections || null;
    const placeholder = config.placeholder || component.placeholder || "Selecciona una opción";
    
    const cacheKey = component.data_source || `static_${component.id}`;
    
    // Estado inicial: intentar obtener del caché
    const [selectOptions, setSelectOptions] = useState<any[]>(() => {
        const cached = getCachedData(cacheKey);
        if (cached && cached.length > 0) {
            return cached;
        }
        return options;
    });
    
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(() => {
        // Si ya hay datos en caché, marcar como cargado
        const cached = getCachedData(cacheKey);
        return cached && cached.length > 0;
    });
    
    // Cargar opciones desde data_source usando caché
    useEffect(() => {
        if (hasLoaded) return;
        
        const loadOptions = async () => {
            if (!component.data_source) {
                setSelectOptions(options);
                setHasLoaded(true);
                return;
            }
            
            // Verificar si ya está cargando globalmente
            if (isGlobalLoading(cacheKey)) return;
            
            // Verificar caché nuevamente
            const cached = getCachedData(cacheKey);
            if (cached && cached.length > 0) {
                setSelectOptions(cached);
                setHasLoaded(true);
                return;
            }
            
            setIsLoading(cacheKey, true);
            setLoadingOptions(true);
            
            try {
                const baseUrl = import.meta.env.VITE_API_URL || '';
                const url = `${baseUrl}${component.data_source}`;
                const response = await fetch(url);
                const data = await response.json();
                
                // Guardar en caché
                setCachedData(cacheKey, data);
                setSelectOptions(data);
                setHasLoaded(true);
            } catch (error) {
                console.error('Error loading select options:', error);
                setSelectOptions([]);
            } finally {
                setLoadingOptions(false);
                setIsLoading(cacheKey, false);
            }
        };
        
        loadOptions();
    }, [component.data_source, options, hasLoaded, cacheKey, getCachedData, setCachedData, isGlobalLoading, setIsLoading]);
    
    const handleSelectChange = (selectedValue: string) => {
        if (!isMultiple) {
            onChange(selectedValue);
        }
    };
    
    const handleMultipleSelectChange = (selectedValue: string) => {
        const selectedValues: string[] = Array.isArray(value)
            ? value.map((v) => String(v))
            : (value !== null && value !== undefined && value !== '')
                ? [String(value)]
                : [];
        
        let values = Array.from(new Set([...selectedValues, selectedValue]));
        
        if (maxSelections && values.length > maxSelections) {
            values = values.slice(0, maxSelections);
        }
        
        onChange(values);
    };
    
    const handleRemoveValue = (valToRemove: string) => {
        const selectedValues: string[] = Array.isArray(value)
            ? value.map((v) => String(v))
            : (value !== null && value !== undefined && value !== '')
                ? [String(value)]
                : [];
        
        const newValues = selectedValues.filter(v => v !== valToRemove);
        onChange(newValues);
    };
    
    const handleClearAll = () => {
        onChange([]);
    };
    
    if (loadingOptions) {
        return (
            <div className="flex items-center gap-2 p-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Cargando opciones...</span>
            </div>
        );
    }
    
    if (selectOptions.length === 0) {
        return (
            <div className="text-sm text-muted-foreground p-2 border rounded">
                No hay opciones disponibles
            </div>
        );
    }
    
    // Select múltiple
    if (isMultiple) {
        const selectedValues: string[] = Array.isArray(value)
            ? value.map((v) => String(v))
            : (value !== null && value !== undefined && value !== '')
                ? [String(value)]
                : [];
        
        return (
            <div className="space-y-2">
                <Select
                    value=""
                    onValueChange={handleMultipleSelectChange}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                        {selectOptions.map((opt) => (
                            <SelectItem key={opt.value} value={String(opt.value)}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                
                {selectedValues.length > 0 && config.allow_clear !== false && (
                    <button
                        onClick={handleClearAll}
                        className="text-xs text-muted-foreground hover:text-red-500 transition-colors"
                    >
                        Limpiar selección
                    </button>
                )}
                
                {selectedValues.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {selectedValues.map((val: string) => {
                            const opt = selectOptions.find(o => String(o.value) === val);
                            return (
                                <span 
                                    key={val} 
                                    className="bg-muted px-2 py-0.5 rounded text-xs flex items-center gap-1"
                                >
                                    {opt?.label || val}
                                    <button
                                        onClick={() => handleRemoveValue(val)}
                                        className="hover:text-red-500 ml-1"
                                    >
                                        ×
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }
    
    // Select simple
    return (
        <Select
            value={value ? String(value) : ""}
            onValueChange={handleSelectChange}
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
                {selectOptions.map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

const BlockEditor: React.FC<Props> = ({ block, module, onChange }) => {
    // Memoizar los componentes ordenados
    const sortedComponents = React.useMemo(
        () => [...module.components].sort((a, b) => a.order - b.order),
        [module.components]
    );
    
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
    const [errorStates, setErrorStates] = useState<Record<string, string>>({});
    const fetchedRef = useRef<Set<string>>(new Set());

    const toInputValue = (v: unknown): string | number => {
        if (typeof v === 'string' || typeof v === 'number') return v;
        return '';
    };

    const fetchExternalData = useCallback(async (component: Component) => {
        if (!component.data_source) return;

        const fetchKey = `${component.id}-${component.name}`;
        if (fetchedRef.current.has(fetchKey)) return;

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
            fetchedRef.current.add(fetchKey);
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

    useEffect(() => {
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
    }, [sortedComponents, fetchExternalData]);

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
                    <SelectField
                        component={component}
                        value={value}
                        onChange={(newValue) => onChange(component.name, newValue)}
                    />
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
            <CardContent className="h-[calc(100vh-240px)] overflow-y-auto space-y-4 custom-scrollbar">
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