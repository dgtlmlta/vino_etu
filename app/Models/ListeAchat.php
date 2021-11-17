<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ListeAchat extends Model
{
    use HasFactory;

    public function bouteilles() {
        return $this->hasMany(Bouteille::class);
    }

    public function users() {
        return $this->hasMany(User::class);
    }
}
