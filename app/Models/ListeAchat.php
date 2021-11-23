<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ListeAchat extends Model
{
    use HasFactory;

    protected $table = "listes_achats";

<<<<<<< HEAD
    protected $guarded = [];  

=======
>>>>>>> 396f337751fdb3053167e3995d5545c6fc2d0323
    public function bouteilles() {
        return $this->belongsToMany(Bouteille::class, 'listes_achats_bouteilles');
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

}
