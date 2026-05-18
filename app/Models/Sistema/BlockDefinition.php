<?php

namespace App\Models\Sistema;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class BlockDefinition extends Model
{
    protected $connection = 'microsite';
    protected $table = 'block_definitions';

    protected $fillable = [
        'name', 'slug', 'description', 'icon', 'is_container', 'max_children'
    ];

    protected $casts = [
        'is_container' => 'boolean',
        'max_children' => 'integer',
    ];

    // Relación polimórfica con componentes
    public function components(): MorphMany
    {
        return $this->morphMany(Component::class, 'definition');
    }
}