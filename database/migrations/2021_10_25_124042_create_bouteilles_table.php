<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateBouteillesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bouteilles', function (Blueprint $table) {
            $table->id();
            $table->string("nom");
            $table->text("description")->nullable();
            $table->string("url_image")->nullable();
            $table->string("url_achat")->nullable();
            $table->string("url_infos")->nullable();
            $table->date("date_achat")->nullable();
            $table->string("format")->nullable();
            $table->foreignId("pays_id")->constrained();
            $table->foreignId("categories_id")->constrained();
            $table->timestamps();
        });

        DB::statement('ALTER TABLE bouteilles as b ADD FULLTEXT search(b.nom, b.description, b.format)');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bouteilles');
    }
}
