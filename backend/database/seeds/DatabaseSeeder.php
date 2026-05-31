<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        User::truncate();

        $etudiants = [
            ['login' => 'alice',   'nom' => 'Alice Martin',  'note1' => 14, 'note2' => 16],
            ['login' => 'bob',     'nom' => 'Bob Dupont',    'note1' => 12, 'note2' => 10],
            ['login' => 'charlie', 'nom' => 'Charlie Durand','note1' => 18, 'note2' => 17],
        ];

        foreach ($etudiants as $etudiant) {
            User::create([
                'login'   => $etudiant['login'],
                'pass'    => Hash::make('123456'),   // mot de passe par défaut
                'nom'     => $etudiant['nom'],
                'note1'   => $etudiant['note1'],
                'note2'   => $etudiant['note2'],
                'moyenne' => ($etudiant['note1'] + $etudiant['note2']) / 2,
            ]);
        }
    }
}