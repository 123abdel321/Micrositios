<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Module extends Model
{
    protected $fillable = ['name', 'description', 'slug'];

    public function components(): HasMany
    {
        return $this->hasMany(Component::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }
}