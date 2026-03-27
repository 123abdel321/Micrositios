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
        'estado'
    ];

    protected $casts = [
        'estado' => 'string'
    ];

}
