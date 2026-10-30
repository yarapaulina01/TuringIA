<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Laptops',
                'description' => 'Computadoras portátiles.',
            ],
            [
                'name' => 'Monitores',
                'description' => 'Monitores y pantallas.',
            ],
            [
                'name' => 'Accesorios',
                'description' => 'Accesorios y periféricos.',
            ],
            [
                'name' => 'Almacenamiento',
                'description' => 'Dispositivos de almacenamiento.',
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['name' => $category['name']],
                ['description' => $category['description']]
            );
        }
    }
}