<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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


    static public function obtenirListeAchatParUtilisateur($userId) {

        $query =
            ListeAchat::select(
                'listes_achats.users_id',
                'listes_achats_bouteilles.id',
                'listes_achats_bouteilles.bouteilles_id',
                'bouteilles.nom',
                'bouteilles.url_image')
            ->join('listes_achats_bouteilles', 'listes_achats_bouteilles.listes_achats_id',  '=', 'listes_achats.id')
            ->join('bouteilles', 'bouteilles.id', '=', 'listes_achats_bouteilles.bouteilles_id')
            ->where("listes_achats.users_id", $userId)
            ->get();

        return $query;

    }

}
