<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::pluck('id', 'name');

        $products = [
            [
                'name' => 'Lenovo IdeaPad 3',
                'description' => 'Laptop para trabajo y estudio.',
                'category_id' => $categories['Laptops'],
                'price' => 12500,
                'stock' => 10,
            ],
            [
                'name' => 'HP 15',
                'description' => 'Laptop de uso general.',
                'category_id' => $categories['Laptops'],
                'price' => 14800,
                'stock' => 8,
            ],
            [
                'name' => 'Monitor LG 24 pulgadas',
                'description' => 'Monitor Full HD de 24 pulgadas.',
                'category_id' => $categories['Monitores'],
                'price' => 2800,
                'stock' => 15,
            ],
            [
                'name' => 'Monitor Samsung 27 pulgadas',
                'description' => 'Monitor LED de 27 pulgadas.',
                'category_id' => $categories['Monitores'],
                'price' => 4200,
                'stock' => 7,
            ],
            [
                'name' => 'Teclado Logitech K120',
                'description' => 'Teclado alámbrico USB.',
                'category_id' => $categories['Accesorios'],
                'price' => 250,
                'stock' => 30,
            ],
            [
                'name' => 'Mouse Logitech M170',
                'description' => 'Mouse inalámbrico.',
                'category_id' => $categories['Accesorios'],
                'price' => 300,
                'stock' => 25,
            ],
            [
                'name' => 'SSD Kingston 480 GB',
                'description' => 'Unidad de estado sólido SATA.',
                'category_id' => $categories['Almacenamiento'],
                'price' => 750,
                'stock' => 12,
            ],
            [
                'name' => 'Memoria USB Kingston 64 GB',
                'description' => 'Memoria USB de 64 GB.',
                'category_id' => $categories['Almacenamiento'],
                'price' => 180,
                'stock' => 40,
            ],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['name' => $product['name']],
                $product
            );
        }
    }
}