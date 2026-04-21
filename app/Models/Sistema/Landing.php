<?php

namespace App\Models\Sistema;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Landing extends Model
{
    protected $connection = 'microsite';

    protected $table = 'landings';

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'is_active',
        'is_principal',
        'order'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_principal' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function blocks(): HasMany
    {
        return $this->hasMany(Submission::class, 'landing_id');
    }
}