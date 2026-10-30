<?php

namespace Tests\Feature\api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ExternalProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_external_products_can_be_obtained(): void
    {
        Http::fake([
            'api.testingapis.com/*' => Http::response([
                [
                    'id' => 1,
                    'name' => 'Laptop de prueba',
                    'price' => 12000,
                ],
                [
                    'id' => 2,
                    'name' => 'Mouse de prueba',
                    'price' => 350,
                ],
            ], 200),
        ]);

        $response = $this->getJson('/api/external-products');

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.name', 'Laptop de prueba');
    }

    public function test_external_api_failure_returns_502(): void
    {
        Http::fake([
            'api.testingapis.com/*' => Http::response([
                'message' => 'Internal Server Error',
            ], 500),
        ]);

        $response = $this->getJson('/api/external-products');

        $response
            ->assertStatus(502)
            ->assertJsonPath('success', false)
            ->assertJsonPath(
                'message',
                'No se pudo consultar la API externa.'
            );
    }
}
