import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Plus,
    Trash2,
    GripVertical,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    MessageCircle
} from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';

interface ColumnType {
    value: string;
    label: string;
}

interface Column {
    id: string;
    type: 'links' | 'social' | 'contact';
    title: string;
    links?: number[];
    socials?: Array<{ platform: string; url: string }>;
    contact?: {
        phones?: string[];
        email?: string;
        address?: string;
        whatsapp?: string;
        whatsapp_message?: string;
    };
}

interface Props {
    value: Column[] | string | null;
    onChange: (value: Column[]) => void;
}

const FooterEditor: React.FC<Props> = ({ value, onChange }) => {
    const { menuItems } = useAppData();
    const [columns, setColumns] = useState<Column[]>([]);
    const isInitialized = useRef(false);

    const columnTypes: ColumnType[] = [
        { value: 'links', label: 'Enlaces' },
        { value: 'social', label: 'Redes Sociales' },
        { value: 'contact', label: 'Contacto' }
    ];
    
    const socialPlatforms = [
        { value: 'facebook', label: 'Facebook', icon: <Facebook size={16} />, default_url: 'https://facebook.com/' },
        { value: 'twitter', label: 'Twitter', icon: <Twitter size={16} />, default_url: 'https://twitter.com/' },
        { value: 'instagram', label: 'Instagram', icon: <Instagram size={16} />, default_url: 'https://instagram.com/' },
        { value: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={16} />, default_url: 'https://linkedin.com/in/' },
        { value: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle size={16} />, default_url: 'https://wa.me/' }
    ];

    // Inicializar desde value UNA SOLA VEZ
    useEffect(() => {
        if (isInitialized.current) return;
        
        let initialColumns: Column[] = [];
        
        if (Array.isArray(value)) {
            initialColumns = value;
        } else if (typeof value === 'string' && value && value !== '[]') {
            try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                    initialColumns = parsed;
                }
            } catch (e) {
                console.error('Error parsing value:', e);
            }
        }
        
        if (initialColumns.length === 0) {
            initialColumns = [{
                id: Date.now().toString(),
                type: 'links',
                title: 'Enlaces',
                links: [],
                socials: [],
                contact: {}
            }];
        }
        
        setColumns(initialColumns);
        isInitialized.current = true;
    }, [value]);

    // Notificar cambios al padre
    useEffect(() => {
        if (isInitialized.current) {
            onChange(columns);
        }
    }, [columns]);

    const addColumn = useCallback(() => {
        if (columns.length >= 5) return;
        setColumns(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                type: 'links',
                title: 'Nueva Columna',
                links: [],
                socials: [],
                contact: {}
            }
        ]);
    }, [columns.length]);

    const removeColumn = useCallback((index: number) => {
        setColumns(prev => prev.filter((_, i) => i !== index));
    }, []);

    const updateColumn = useCallback((index: number, updates: Partial<Column>) => {
        setColumns(prev => prev.map((col, i) => 
            i === index ? { ...col, ...updates } : col
        ));
    }, []);

    const renderLinksColumn = (column: Column, index: number) => {
        const selectedIds = column.links || [];
        
        return (
            <div className="space-y-2">
                <Label>Seleccionar enlaces</Label>
                <Select
                    value=""
                    onValueChange={(val) => {
                        const newIds = [...selectedIds, parseInt(val)];
                        updateColumn(index, { links: newIds });
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Agregar enlace" />
                    </SelectTrigger>
                    <SelectContent>
                        {menuItems && menuItems.map((item: any) => (
                            <SelectItem key={item.id} value={String(item.id)}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedIds.map((id) => {
                        const item = menuItems?.find((i: any) => i.id === id);
                        return (
                            <span key={id} className="bg-muted px-2 py-1 rounded text-sm flex items-center gap-1">
                                {item?.label || id}
                                <button
                                    onClick={() => {
                                        updateColumn(index, { 
                                            links: selectedIds.filter(i => i !== id) 
                                        });
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ×
                                </button>
                            </span>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderSocialColumn = (column: Column, index: number) => {
        const socials = column.socials || [];
        
        return (
            <div className="space-y-2">
                <Label>Redes sociales</Label>
                {socials.map((social, sIdx) => (
                    <div key={sIdx} className="flex gap-2">
                        <Select
                            value={social.platform}
                            onValueChange={(val) => {
                                const newSocials = [...socials];
                                newSocials[sIdx] = { ...social, platform: val };
                                updateColumn(index, { socials: newSocials });
                            }}
                        >
                            <SelectTrigger className="w-1/3">
                                <SelectValue placeholder="Plataforma" />
                            </SelectTrigger>
                            <SelectContent>
                                {socialPlatforms.map((p) => (
                                    <SelectItem key={p.value} value={p.value}>
                                        <div className="flex items-center gap-2">
                                            {p.icon}
                                            <span>{p.label}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder="URL"
                            value={social.url}
                            onChange={(e) => {
                                const newSocials = [...socials];
                                newSocials[sIdx] = { ...social, url: e.target.value };
                                updateColumn(index, { socials: newSocials });
                            }}
                            className="flex-1"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                updateColumn(index, { 
                                    socials: socials.filter((_, i) => i !== sIdx) 
                                });
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        updateColumn(index, { 
                            socials: [...socials, { platform: 'facebook', url: '' }] 
                        });
                    }}
                >
                    <Plus className="h-4 w-4 mr-1" /> Agregar red social
                </Button>
            </div>
        );
    };

    const renderContactColumn = (column: Column, index: number) => {
        const contact = column.contact || {};
        const phones = contact.phones || [];
        
        return (
            <div className="space-y-3">
                <div>
                    <Label>Teléfonos</Label>
                    {phones.map((phone, pIdx) => (
                        <div key={pIdx} className="flex gap-2 mt-1">
                            <Input
                                value={phone}
                                onChange={(e) => {
                                    const newPhones = [...phones];
                                    newPhones[pIdx] = e.target.value;
                                    updateColumn(index, { 
                                        contact: { ...contact, phones: newPhones } 
                                    });
                                }}
                                placeholder="+123 456 7890"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    updateColumn(index, { 
                                        contact: { ...contact, phones: phones.filter((_, i) => i !== pIdx) } 
                                    });
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-1"
                        onClick={() => {
                            updateColumn(index, { 
                                contact: { ...contact, phones: [...phones, ''] } 
                            });
                        }}
                    >
                        <Plus className="h-4 w-4 mr-1" /> Agregar teléfono
                    </Button>
                </div>
                
                <div>
                    <Label>Email</Label>
                    <Input
                        value={contact.email || ''}
                        onChange={(e) => {
                            updateColumn(index, { 
                                contact: { ...contact, email: e.target.value } 
                            });
                        }}
                        placeholder="info@tuempresa.com"
                    />
                </div>
                
                <div>
                    <Label>Dirección</Label>
                    <Input
                        value={contact.address || ''}
                        onChange={(e) => {
                            updateColumn(index, { 
                                contact: { ...contact, address: e.target.value } 
                            });
                        }}
                        placeholder="Calle Principal 123, Ciudad"
                    />
                </div>
                
                <div>
                    <Label>WhatsApp</Label>
                    <Input
                        value={contact.whatsapp || ''}
                        onChange={(e) => {
                            updateColumn(index, { 
                                contact: { ...contact, whatsapp: e.target.value } 
                            });
                        }}
                        placeholder="+1234567890"
                    />
                </div>
                
                <div>
                    <Label>Mensaje WhatsApp (opcional)</Label>
                    <Input
                        value={contact.whatsapp_message || ''}
                        onChange={(e) => {
                            updateColumn(index, { 
                                contact: { ...contact, whatsapp_message: e.target.value } 
                            });
                        }}
                        placeholder="Hola, me gustaría más información"
                    />
                </div>
            </div>
        );
    };

    if (!isInitialized.current) {
        return <div className="p-4 text-center">Cargando columnas...</div>;
    }

    return (
        <div className="h-full overflow-y-auto space-y-4 custom-scrollbar">
            {columns.map((column, index) => (
                <Card key={column.id} className="relative">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2 flex-1">
                                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                                <Input
                                    value={column.title}
                                    onChange={(e) => updateColumn(index, { title: e.target.value })}
                                    className="flex-1 min-w-[120px] font-semibold"
                                    placeholder="Título de la columna"
                                />
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <Select
                                    value={column.type}
                                    onValueChange={(val: any) => updateColumn(index, { type: val })}
                                >
                                    <SelectTrigger className="w-[110px] h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {columnTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => removeColumn(index)}
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {column.type === 'links' && renderLinksColumn(column, index)}
                        {column.type === 'social' && renderSocialColumn(column, index)}
                        {column.type === 'contact' && renderContactColumn(column, index)}
                    </CardContent>
                </Card>
            ))}
            
            {columns.length < 5 && (
                <Button onClick={addColumn} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> Agregar columna ({columns.length}/5)
                </Button>
            )}
        </div>
    );
};

export default FooterEditor;