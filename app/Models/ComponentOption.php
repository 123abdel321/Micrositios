<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComponentOption extends Model
{
    protected $fillable = ['component_id', 'label', 'value', 'order'];

    public function component(): BelongsTo
    {
        return $this->belongsTo(Component::class);
    }
}