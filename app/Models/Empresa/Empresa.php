<?php

namespace App\Models\Empresa;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    protected $connection = 'clientes';

    protected $table = 'empresas';

    protected $fillable = [
        'id',
        'token_db',
        'razon_social',
        'nit',
        'direccion',
        'telefono',
        'email',
        'logo',
        'hash',
        'estado',
        'subdomain',
        'custom_domain',
        'domain_type',
    ];

    protected $casts = [
        'estado' => 'string',
    ];
    
    /**
     * Obtener la URL base de la empresa
     */
    public function getBaseUrlAttribute(): string
    {
        if ($this->domain_type === 'custom' && $this->custom_domain) {
            return 'https://' . $this->custom_domain;
        }
        
        if ($this->subdomain) {
            $baseDomain = config('app.base_domain', 'micrositios.com');
            return 'https://' . $this->subdomain . '.' . $baseDomain;
        }
        
        // Fallback: usar el dominio principal con un prefijo
        return url('/empresa/' . $this->id);
    }
    
    /**
     * Relación con los landings de esta empresa (a través del user_id)
     */
    public function landings()
    {
        return $this->hasMany(\App\Models\Sistema\Landing::class, 'user_id', 'user_id');
    }
}