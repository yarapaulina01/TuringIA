<?php

namespace Tests\Feature\api;

use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Product;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_anyone_can_get_the_category_list(): void
    {
        Category::create([
            'name' => 'Computadoras',
            'description' => 'Equipos de cómputo',
        ]);

        $response = $this->getJson('/api/categories');

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Computadoras')
            ->assertJsonPath('data.0.products_count', 0);
    }

    public function test_anyone_can_get_a_single_category(): void
    {
        $category = Category::create([
            'name' => 'Periféricos',
            'description' => 'Accesorios para computadora',
        ]);

        $response = $this->getJson('/api/categories/' . $category->id);

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Periféricos')
            ->assertJsonPath('data.description', 'Accesorios para computadora')
            ->assertJsonPath('data.products', []);
    }

    public function test_admin_can_create_a_category(): void
    {
        $admin = \App\Models\User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/categories', [
                'name' => 'Celulares',
                'description' => 'Teléfonos y accesorios móviles',
            ]);

        $response
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Celulares');

        $this->assertDatabaseHas('categories', [
            'name' => 'Celulares',
            'description' => 'Teléfonos y accesorios móviles',
        ]);
    }

    public function test_admin_can_update_a_category(): void
    {
        $category = Category::create([
            'name' => 'Laptops',
            'description' => 'Computadoras portátiles',
        ]);

        $admin = \App\Models\User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->putJson('/api/categories/' . $category->id, [
                'name' => 'Laptops y Notebooks',
                'description' => 'Equipos portátiles',
            ]);

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Laptops y Notebooks')
            ->assertJsonPath('data.description', 'Equipos portátiles');

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Laptops y Notebooks',
        ]);
    }

    public function test_admin_can_delete_an_empty_category(): void
    {
        $category = Category::create([
            'name' => 'Tablets',
            'description' => 'Dispositivos móviles',
        ]);

        $admin = \App\Models\User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->deleteJson('/api/categories/' . $category->id);

        $response
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('categories', [
            'id' => $category->id,
        ]);
    }


    public function test_category_with_products_cannot_be_deleted(): void
    {
        $category = Category::create([
            'name' => 'Audio',
            'description' => 'Productos de audio',
        ]);

        Product::create([
            'category_id' => $category->id,
            'name' => 'Audífonos Bluetooth',
            'description' => 'Audífonos inalámbricos',
            'price' => 650,
            'stock' => 10,
        ]);

        $admin = \App\Models\User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->deleteJson('/api/categories/' . $category->id);

        $response
            ->assertStatus(409)
            ->assertJsonPath('success', false);

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
        ]);
    }


    public function test_regular_user_cannot_create_a_category(): void
    {
        $user = \App\Models\User::factory()->create([
            'role' => 'user',
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/categories', [
                'name' => 'Impresoras',
                'description' => 'Equipos de impresión',
            ]);

        $response->assertForbidden();

        $this->assertDatabaseMissing('categories', [
            'name' => 'Impresoras',
        ]);
    }


    public function test_regular_user_cannot_delete_a_category(): void
    {
        $category = Category::create([
            'name' => 'Cámaras',
            'description' => 'Equipos fotográficos',
        ]);

        $user = \App\Models\User::factory()->create([
            'role' => 'user',
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson('/api/categories/' . $category->id);

        $response->assertForbidden();

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
        ]);
    }
}
