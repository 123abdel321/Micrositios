<?php

namespace App\Models\Sistema;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Component extends Model
{
    protected $connection = 'microsite';

    protected $table = 'components';

    protected $fillable = [
        'module_id',
        'label',
        'name',
        'type',
        'placeholder',
        'is_required',
        'order',
        'validation_rules',
        'data_source',
        'configuration'
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'validation_rules' => 'array',
        'configuration' => 'array',
    ];

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