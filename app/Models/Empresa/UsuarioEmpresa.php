<?php

namespace App\Models\Empresa;

use Illuminate\Database\Eloquent\Model;

class UsuarioEmpresa extends Model
{
    protected $connection = 'clientes';

    protected $table = 'usuario_empresas';

    protected $fillable = [
        'id',
        'id_usuario',
        'id_empresa'
    ];
}
