<?php

namespace App\Models\Sistema;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Component extends Model
{
    protected $connection = 'microsite';
    protected $table = 'components';

    protected $fillable = [
        'module_id',
        'definition_type',
        'definition_id',
        'label',
        'name',
        'type',
        'color_mode',
        'placeholder',
        'is_required',
        'order',
        'validation_rules',
        'data_source',
        'configuration',
        'field_group',
        'depends_on',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'validation_rules' => 'array',
        'configuration' => 'array',
    ];

    // Relación polimórfica (puede pertenecer a Module o BlockDefinition)
    public function definition(): MorphTo
    {
        return $this->morphTo();
    }

    // Relación legacy con módulo (para compatibilidad)
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function options(): HasMany
    {
        return $this->hasMany(ComponentOption::class);
    }

    public function fieldValues(): HasMany
    {
        return $this->hasMany(FieldValue::class);
    }
}