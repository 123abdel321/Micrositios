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
        'user_id'
    ];

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function fieldValues(): HasMany
    {
        return $this->hasMany(FieldValue::class);
    }

    public function landing(): BelongsTo
    {
        return $this->belongsTo(Landing::class);
    }
}