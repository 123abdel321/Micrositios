import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Block, Module, Component, BlockDefinition } from '@/types/builder';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';
import FooterEditor from '@/components/blocks/FooterEditor';
import apiClient from '@/utils/api';

interface Props {
    block: Block;
    definition: Module | BlockDefinition; // ← correcto
    onChange: (fieldName: string, value: any) => void;
}

const SelectField: React.FC<{
    component: Component;
    value: any;
    onChange: (value: any) => void;
}> = ({ component, value, onChange }) => {
    const { getCachedData, setCachedData, isLoading: isGlobalLoading, getOrCreatePromise } = useAppData();
    const config = component.configuration as any || {};
    const options = React.useMemo(() => config.options || [], [config.options]);
    const isMultiple = config.is_multiple || false;
    const maxSelections = config.max_selections || null;
    const placeholder = config.placeholder || component.placeholder || "Selecciona una opción";
    const cacheKey = component.data_source || `static_${component.id}`;
    
    const [selectOptions, setSelectOptions] = useState<any[]>(() => {
        const cached = getCachedData(cacheKey);
        if (cached && cached.length > 0) return cached;
        return options;
    });
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(() => {
        const cached = getCachedData(cacheKey);
        return cached && cached.length > 0;
    });
    
    useEffect(() => {
        if (hasLoaded || selectOptions.length > 0) return;
        const loadOptions = async () => {
            if (!component.data_source) {
                setSelectOptions(options);
                setHasLoaded(true);
                return;
            }
            const cached = getCachedData(cacheKey);
            if (cached && cached.length > 0) {
                setSelectOptions(cached);
                setHasLoaded(true);
                return;
            }
            setLoadingOptions(true);
            try {
                const fetcher = async () => {
                    const response = await apiClient.get(component.data_source ?? '');
                    return response.data;
                };
                const data = await getOrCreatePromise(cacheKey, fetcher);
                setCachedData(cacheKey, data);
                setSelectOptions(data);
                setHasLoaded(true);
            } catch (error) {
                console.error('Error loading select options:', error);
                setSelectOptions([]);
                setHasLoaded(true);
            } finally {
                setLoadingOptions(false);
            }
        };
        loadOptions();
    }, [component.data_source, options, hasLoaded, cacheKey, getCachedData, setCachedData, getOrCreatePromise, selectOptions.length]);
    
    if (loadingOptions || isGlobalLoading(cacheKey)) {
        return (
            <div className="flex items-center gap-2 p-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Cargando opciones...</span>
            </div>
        );
    }
    
    if (selectOptions.length === 0 && hasLoaded) {
        return (
            <div className="text-sm text-red-500 border rounded p-2">
                <p>Error al cargar las opciones</p>
                <button onClick={() => { setHasLoaded(false); setSelectOptions([]); }} className="text-xs underline mt-1">
                    Reintentar
                </button>
            </div>
        );
    } else if (selectOptions.length === 0) {
        return (
            <div className="text-sm text-muted-foreground p-2 border rounded">
                No hay opciones disponibles
            </div>
        );
    }
    
    const handleSelectChange = (selectedValue: string) => {
        if (!isMultiple) onChange(selectedValue);
    };
    
    const handleMultipleSelectChange = (selectedValue: string) => {
        const selectedValues: string[] = Array.isArray(value)
            ? value.map((v) => String(v))
            : (value !== null && value !== undefined && value !== '') ? [String(value)] : [];
        let values = Array.from(new Set([...selectedValues, selectedValue]));
        if (maxSelections && values.length > maxSelections) values = values.slice(0, maxSelections);
        onChange(values);
    };
    
    const handleRemoveValue = (valToRemove: string) => {
        const selectedValues: string[] = Array.isArray(value)
            ? value.map((v) => String(v))
            : (value !== null && value !== undefined && value !== '') ? [String(value)] : [];
        const newValues = selectedValues.filter(v => v !== valToRemove);
        onChange(newValues);
    };
    
    const handleClearAll = () => onChange([]);
    
    if (isMultiple) {
        const selectedValues: string[] = Array.isArray(value)
            ? value.map((v) => String(v))
            : (value !== null && value !== undefined && value !== '') ? [String(value)] : [];
        return (
            <div className="space-y-2">
                <Select value="" onValueChange={handleMultipleSelectChange}>
                    <SelectTrigger className="w-full"><SelectValue placeholder={placeholder} /></SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                        {selectOptions.map((opt) => (
                            <SelectItem key={opt.id} value={String(`${opt.id}`)}>{opt.id} - {opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {selectedValues.length > 0 && config.allow_clear !== false && (
                    <button onClick={handleClearAll} className="text-xs text-muted-foreground hover:text-red-500">Limpiar selección</button>
                )}
                {selectedValues.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {selectedValues.map((val: string) => {
                            const opt = selectOptions.find(o => String(o.id) === val);
                            return (
                                <span key={val} className="bg-muted px-2 py-0.5 rounded text-xs flex items-center gap-1">
                                    {opt?.label || val}
                                    <button onClick={() => handleRemoveValue(val)} className="hover:text-red-500 ml-1">×</button>
                                </span>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }
    
    return (
        <Select value={value ? String(value) : ""} onValueChange={handleSelectChange}>
            <SelectTrigger className="w-full"><SelectValue placeholder={placeholder} /></SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
                {selectOptions.map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>{opt.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

const BlockEditor: React.FC<Props> = ({ block, definition, onChange }) => {
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
    const [errorStates, setErrorStates] = useState<Record<string, string>>({});
    const loadedExternalRef = useRef<Set<string>>(new Set());

    // Ordenar componentes (usando definition.components)
    const sortedComponents = useMemo(
        () => [...definition.components].sort((a, b) => a.order - b.order),
        [definition.components]
    );

    // Agrupar componentes y aplicar dependencias
    const { groups, noGroup } = useMemo(() => {
        const groupsMap: Record<string, Component[]> = {};
        const noGroupList: Component[] = [];

        sortedComponents.forEach(comp => {
            if (comp.depends_on) {
                const parentValue = block.values[comp.depends_on];
                const isEmpty = !parentValue || (Array.isArray(parentValue) && parentValue.length === 0);
                if (isEmpty) return;
            }
            const group = comp.field_group;
            if (group && group.trim() !== '') {
                if (!groupsMap[group]) groupsMap[group] = [];
                groupsMap[group].push(comp);
            } else {
                noGroupList.push(comp);
            }
        });
        return { groups: groupsMap, noGroup: noGroupList };
    }, [sortedComponents, block.values]);

    const toInputValue = (v: unknown): string | number => (typeof v === 'string' || typeof v === 'number') ? v : '';

    const fetchExternalData = useCallback(async (component: Component) => {
        if (!component.data_source) return;
        const fetchKey = `${component.id}-${component.name}`;
        if (loadedExternalRef.current.has(fetchKey)) return;
        const currentValue = block.values[component.name];
        if (currentValue && (Array.isArray(currentValue) && currentValue.length > 0) || 
            (typeof currentValue === 'object' && currentValue !== null && Object.keys(currentValue).length > 0)) {
            loadedExternalRef.current.add(fetchKey);
            return;
        }
        setLoadingStates(prev => ({ ...prev, [component.name]: true }));
        setErrorStates(prev => ({ ...prev, [component.name]: '' }));
        try {
            const baseUrl = import.meta.env.VITE_API_URL || '';
            const url = `${baseUrl}${component.data_source}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            const data = await response.json();
            loadedExternalRef.current.add(fetchKey);
            onChange(component.name, data);
        } catch (error) {
            setErrorStates(prev => ({ ...prev, [component.name]: error instanceof Error ? error.message : 'Error al cargar datos' }));
            loadedExternalRef.current.add(fetchKey);
        } finally {
            setLoadingStates(prev => ({ ...prev, [component.name]: false }));
        }
    }, [block.values, onChange]);

    useEffect(() => {
        let isMounted = true;
        const loadExternalData = async () => {
            for (const component of definition.components) {
                if (component.type === 'external' && component.data_source && isMounted) {
                    const fetchKey = `${component.id}-${component.name}`;
                    if (!loadedExternalRef.current.has(fetchKey)) await fetchExternalData(component);
                }
            }
        };
        loadExternalData();
        return () => { isMounted = false; };
    }, [definition.components, fetchExternalData]);

    const renderField = useCallback((component: Component) => {
        const value = block.values[component.name] ?? '';
        const isLoading = loadingStates[component.name];
        const error = errorStates[component.name];
        switch (component.type) {
            case 'text':
            case 'number':
                return <Input type={component.type} value={toInputValue(value)} onChange={e => onChange(component.name, e.target.value)} placeholder={component.placeholder || undefined} required={component.is_required} />;
            case 'color':
                return <div className="flex gap-2"><Input type="color" value={typeof value === 'string' && value ? value : '#000000'} onChange={e => onChange(component.name, e.target.value)} className="w-12 p-1 h-10" /><Input type="text" value={toInputValue(value)} onChange={e => onChange(component.name, e.target.value)} placeholder="#000000" className="flex-1" /></div>;
            case 'select':
                return <SelectField component={component} value={value} onChange={newValue => onChange(component.name, newValue)} />;
            case 'toggle':
                return <Switch checked={!!value} onCheckedChange={checked => onChange(component.name, checked)} />;
            case 'image':
                return <div className="space-y-2"><Input type="url" value={toInputValue(value)} onChange={e => onChange(component.name, e.target.value)} placeholder={component.placeholder || 'https://example.com/image.jpg'} />{typeof value === 'string' && value && <img src={value} alt="Preview" className="max-w-full h-32 object-cover rounded border" />}</div>;
            case 'external':
                if (component.name === 'footer_columns') {
                    return <FooterEditor value={Array.isArray(value) || typeof value === 'string' || value === null ? value : null} onChange={newValue => onChange(component.name, newValue)} />;
                }
                return (
                    <div className="text-sm border rounded bg-muted/50">
                        {isLoading ? <div className="flex items-center justify-center p-4"><Loader2 className="h-4 w-4 animate-spin mr-2" />Cargando...</div> :
                         error ? <div className="p-4 text-red-500"><p>{error}</p><button onClick={() => { const key = `${component.id}-${component.name}`; loadedExternalRef.current.delete(key); fetchExternalData(component); }} className="text-xs underline">Reintentar</button></div> :
                         <div className="p-3">{value ? <pre className="text-xs overflow-auto max-h-40 p-2 bg-muted rounded">{JSON.stringify(value, null, 2)}</pre> : <p className="text-xs italic">Sin datos</p>}</div>}
                    </div>
                );
            case 'range': {
                const config = (component.configuration as any) || { min: 0, max: 100, step: 1, unit: '' };
                return <div className="flex items-center gap-4"><input type="range" min={config.min} max={config.max} step={config.step} value={Number(value) || config.min} onChange={e => onChange(component.name, Number(e.target.value))} className="flex-1" /><span className="text-sm font-mono min-w-[60px]">{value}{config.unit}</span></div>;
            }
            default: return null;
        }
    }, [block.values, loadingStates, errorStates, onChange, fetchExternalData]);

    return (
        <CardContent className="h-[calc(100vh-240px)] overflow-y-auto space-y-5 w-full p-2 py-5">
            {Object.entries(groups).map(([groupName, comps]) => (
                <div key={groupName} className="border rounded-lg p-3 bg-muted/10">
                    <h4 className="text-sm font-semibold capitalize border-b pb-1 mb-2">{groupName.replace(/_/g, ' ')}</h4>
                    {comps.map(comp => <div key={comp.id}><Label>{comp.label}{comp.is_required && <span className="text-red-500 ml-1">*</span>}</Label>{renderField(comp)}</div>)}
                </div>
            ))}
            {noGroup.map(comp => <div key={comp.id}><Label>{comp.label}{comp.is_required && <span className="text-red-500 ml-1">*</span>}</Label>{renderField(comp)}</div>)}
        </CardContent>
    );
};

export default BlockEditor;