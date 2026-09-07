<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pos_expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscriber_id')->constrained('pos_subscribers');
            $table->foreignId('pos_expense_category_id')->constrained('pos_expense_categories');
            $table->string('title');
            $table->decimal('amount', 12, 2)->default(0);
            $table->text('description')->nullable();
            $table->date('expense_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pos_expenses');
    }
};
