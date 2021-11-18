<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateListesAchatsBouteillesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('listes_achats_bouteilles', function (Blueprint $table) {
            $table->id();
            $table->foreignId("bouteilles_id")->nullable()->constrained()->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId("listes_achats_id")->nullable()->constrained()->cascadeOnUpdate()->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('listes_achats_bouteilles');
    }
}
