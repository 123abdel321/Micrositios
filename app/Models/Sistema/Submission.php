<?php

namespace App\Models\Sistema;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Submission extends Model
{
    protected $connection = 'microsite';
    protected $table = 'submissions';

    protected $fillable = [
        'module_id',
        'block_definition_id',
        'user_id',
        'landing_id',
        'parent_id',
        'type',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    // Relación con el módulo (si es sección)
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    // Relación con block_definition (si es bloque atómico)
    public function blockDefinition(): BelongsTo
    {
        return $this->belongsTo(BlockDefinition::class);
    }

    // Relación con el padre (si está anidado)
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Submission::class, 'parent_id');
    }

    // Relación con los hijos (bloques anidados)
    public function children(): HasMany
    {
        return $this->hasMany(Submission::class, 'parent_id')->orderBy('order');
    }

    public function landing(): BelongsTo
    {
        return $this->belongsTo(Landing::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function fieldValues(): HasMany
    {
        return $this->hasMany(FieldValue::class);
    }

    // Helper para obtener la definición (module o blockDefinition) según el tipo
    public function getDefinitionAttribute()
    {
        if ($this->type === 'section') {
            return $this->module;
        }
        return $this->blockDefinition;
    }
}