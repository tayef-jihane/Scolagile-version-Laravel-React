<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /**
     * Register a new student/user
     */
    public function register(Request $request)
{
    $validator = Validator::make($request->all(), [
        'login' => 'required|string|max:20|unique:etudiants,login',
        'pass'  => 'required|string|min:6',
        'nom'   => 'required|string|max:20',
        // ✅ note1, note2, longitude, latitude sont optionnels
        'note1'     => 'nullable|integer|min:0|max:20',
        'note2'     => 'nullable|integer|min:0|max:20',
        'longitude' => 'nullable|numeric',
        'latitude'  => 'nullable|numeric',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors'  => $validator->errors()
        ], 422);
    }

    $note1 = $request->note1 ?? 0;
    $note2 = $request->note2 ?? 0;
    $moyenne = ($note1 + $note2) / 2;

    // ✅ longitude et latitude sont NULL par défaut
    $user = User::create([
        'login'     => $request->login,
        'pass'      => Hash::make($request->pass),
        'nom'       => $request->nom,
        'note1'     => $note1,
        'note2'     => $note2,
        'moyenne'   => $moyenne,
        'longitude' => $request->longitude, // Peut être NULL
        'latitude'  => $request->latitude,  // Peut être NULL
    ]);

    try {
        $token = JWTAuth::fromUser($user);
    } catch (JWTException $e) {
        return response()->json([
            'success' => false,
            'error'   => 'Impossible de créer le token'
        ], 500);
    }

    return response()->json([
        'success' => true,
        'token'   => $token,
        'user'    => [
            'id'        => $user->id,
            'login'     => $user->login,
            'nom'       => $user->nom,
            'note1'     => $user->note1,
            'note2'     => $user->note2,
            'moyenne'   => $user->moyenne,
            'longitude' => $user->longitude,
            'latitude'  => $user->latitude,
        ]
    ], 201);
}

    /**
     * Login
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login' => 'required|string',
            'pass'  => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors()
            ], 422);
        }

        $user = User::where('login', $request->login)->first();

        if (!$user || !Hash::check($request->pass, $user->pass)) {
            return response()->json([
                'success' => false,
                'error'   => 'Login ou mot de passe incorrect'
            ], 401);
        }

        try {
            $token = JWTAuth::fromUser($user);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'error'   => 'Impossible de créer le token'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'token'   => $token,
            'user'    => [
                'id'        => $user->id,
                'login'     => $user->login,
                'nom'       => $user->nom,
                'note1'     => $user->note1,
                'note2'     => $user->note2,
                'moyenne'   => $user->moyenne,
                'longitude' => $user->longitude,
                'latitude'  => $user->latitude,
            ]
        ]);
    }

    /**
     * Logout
     */
    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['success' => true, 'message' => 'Déconnexion réussie']);
        } catch (JWTException $e) {
            return response()->json(['success' => false, 'error' => 'Erreur lors de la déconnexion'], 500);
        }
    }

    /**
     * Get current user
     */
    public function me()
    {
        $user = JWTAuth::parseToken()->authenticate();
        return response()->json([
            'success' => true,
            'user'    => [
                'id'        => $user->id,
                'login'     => $user->login,
                'nom'       => $user->nom,
                'note1'     => $user->note1,
                'note2'     => $user->note2,
                'moyenne'   => $user->moyenne,
                'longitude' => $user->longitude,
                'latitude'  => $user->latitude,
            ]
        ]);
    }
}
