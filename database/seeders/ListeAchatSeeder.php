<?php

namespace Database\Seeders;

use App\Models\ListeAchat;
use Illuminate\Database\Seeder;

class ListeAchatSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        $listeAchat = [
            "users_id"    => 1,
        ];

        ListeAchat::create($listeAchat);
    }
}
