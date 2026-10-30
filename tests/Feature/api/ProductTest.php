<?php

namespace Tests\Feature\api;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_anyone_can_get_the_product_list(): void
    {
        $category = Category::create([
            'name' => 'Accesorios',
            'description' => 'Accesorios tecnológicos',
        ]);

        Product::create([
            'category_id' => $category->id,
            'name' => 'Mouse inalámbrico',
            'description' => 'Mouse de prueba',
            'price' => 350,
            'stock' => 10,
        ]);

        $response = $this->getJson('/api/products');

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Mouse inalámbrico')
            ->assertJsonPath('data.0.category.name', 'Accesorios');
    }

    public function test_anyone_can_get_a_single_product(): void
    {
        $category = Category::create([
            'name' => 'Computadoras',
            'description' => 'Equipos de cómputo',
        ]);

        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Laptop Lenovo',
            'description' => 'Laptop de prueba',
            'price' => 12500,
            'stock' => 5,
        ]);

        $response = $this->getJson('/api/products/' . $product->id);

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Laptop Lenovo')
            ->assertJsonPath('data.price', '12500.00')
            ->assertJsonPath('data.category.name', 'Computadoras');
    }

    public function test_only_admin_can_create_a_product(): void
    {
        $category = Category::create([
            'name' => 'Periféricos',
            'description' => 'Accesorios para computadora',
        ]);

        $user = \App\Models\User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/products', [
                'category_id' => $category->id,
                'name' => 'Teclado mecánico',
                'description' => 'Teclado RGB',
                'price' => 850,
                'stock' => 12,
            ]);

        $response
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Teclado mecánico');

        $this->assertDatabaseHas('products', [
            'name' => 'Teclado mecánico',
            'price' => 850,
        ]);
    }

    public function test_admin_can_update_a_product(): void
    {
        $category = Category::create([
            'name' => 'Monitores',
            'description' => 'Pantallas y monitores',
        ]);

        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Monitor Samsung',
            'description' => 'Monitor de 24 pulgadas',
            'price' => 2500,
            'stock' => 8,
        ]);

        $admin = \App\Models\User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->putJson('/api/products/' . $product->id, [
                'name' => 'Monitor Samsung Curvo',
                'price' => 3200,
                'stock' => 5,
            ]);

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Monitor Samsung Curvo')
            ->assertJsonPath('data.price', '3200.00');

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Monitor Samsung Curvo',
            'price' => 3200,
            'stock' => 5,
        ]);
    }


    public function test_admin_can_delete_a_product(): void
    {
        $category = Category::create([
            'name' => 'Almacenamiento',
            'description' => 'Dispositivos de almacenamiento',
        ]);

        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Memoria USB',
            'description' => 'USB de 64 GB',
            'price' => 180,
            'stock' => 20,
        ]);

        $admin = \App\Models\User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->deleteJson('/api/products/' . $product->id);

        $response
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('products', [
            'id' => $product->id,
        ]);
    }


    public function test_regular_user_cannot_create_a_product(): void
    {
        $category = Category::create([
            'name' => 'Accesorios',
            'description' => 'Accesorios tecnológicos',
        ]);

        $user = \App\Models\User::factory()->create([
            'role' => 'user',
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/products', [
                'category_id' => $category->id,
                'name' => 'Audífonos',
                'description' => 'Audífonos inalámbricos',
                'price' => 500,
                'stock' => 10,
            ]);

        $response->assertForbidden();

        $this->assertDatabaseMissing('products', [
            'name' => 'Audífonos',
        ]);
    }
}
