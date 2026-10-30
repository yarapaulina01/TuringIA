<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@technoshop.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('Admin12345'),
            ]
        );

        $admin->forceFill(['role' => 'admin'])->save();

        $user = User::updateOrCreate(
            ['email' => 'usuario@technoshop.com'],
            [
                'name' => 'Usuario de prueba',
                'password' => Hash::make('User12345'),
            ]
        );

        $user->forceFill(['role' => 'user'])->save();
    }
}