<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ExternalProductController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $response = Http::timeout(10)
            ->get('https://api.testingapis.com/api/Products/category/electronics');

            if ($response->failed()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se pudo consultar la API externa.',
                ], 502);
            }

            return response()->json([
                'success' => true,
                'message' => 'Productos externos obtenidos correctamente.',
                'data' => $response->json(),
            ]);

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
    Log::error('Error al conectar con DummyJSON', [
        'exception' => $e->getMessage(),
    ]);

    return response()->json([
        'success' => false,
        'message' => 'No fue posible conectar con la API externa.',
    ], 502);
}
    }
}
