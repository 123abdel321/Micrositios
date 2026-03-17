<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FieldValue extends Model
{
    protected $fillable = ['submission_id', 'component_id', 'value'];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    public function component(): BelongsTo
    {
        return $this->belongsTo(Component::class);
    }
}