<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ListeAchat extends Model
{
    use HasFactory;


    protected $table = "listes_achats";

    protected $guarded = [];

    public function bouteilles() {
        return $this->belongsToMany(Bouteille::class, 'listes_achats_bouteilles');
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

}
