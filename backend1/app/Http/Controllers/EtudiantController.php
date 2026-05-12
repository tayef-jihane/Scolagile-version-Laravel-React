<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EtudiantController extends Controller
{
    /**
     * Get all students (for stats/geoloc)
     */
    public function index()
    {
        try {
            $etudiants = User::select(
                'id', 'nom', 'login', 'note1', 'note2', 'moyenne', 'longitude', 'latitude'
            )->get();

            return response()->json([
                'success' => true,
                'data' => $etudiants
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erreur lors de la récupération des étudiants: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single student
     */
    public function show(int $id)
    {
        try {
            $etudiant = User::find($id);
            if (!$etudiant) {
                return response()->json([
                    'success' => false,
                    'error' => 'Étudiant non trouvé'
                ], 404);
            }
            return response()->json([
                'success' => true,
                'data' => $etudiant
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erreur lors de la récupération de l\'étudiant: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update student notes
     */
    public function update(Request $request, int $id)
    {
        try {
            $etudiant = User::find($id);
            if (!$etudiant) {
                return response()->json([
                    'success' => false,
                    'error' => 'Étudiant non trouvé'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'nom'       => 'sometimes|string|max:20',
                'note1'     => 'sometimes|integer|min:0|max:20',
                'note2'     => 'sometimes|integer|min:0|max:20',
                'longitude' => 'sometimes|nullable|numeric|between:-180,180',
                'latitude'  => 'sometimes|nullable|numeric|between:-90,90',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            if ($request->has('nom'))       $etudiant->nom       = $request->nom;
            if ($request->has('note1'))     $etudiant->note1     = $request->note1;
            if ($request->has('note2'))     $etudiant->note2     = $request->note2;
            if ($request->has('longitude')) $etudiant->longitude = $request->longitude;
            if ($request->has('latitude'))  $etudiant->latitude  = $request->latitude;

            $etudiant->moyenne = ($etudiant->note1 + $etudiant->note2) / 2;
            $etudiant->save();

            return response()->json([
                'success' => true,
                'data' => $etudiant
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erreur lors de la mise à jour: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update geolocation for current user
     */
    public function updateGeoloc(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'longitude' => 'required|numeric|between:-180,180',
            'latitude'  => 'required|numeric|between:-90,90',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = auth()->user();
            $user->longitude = $request->longitude;
            $user->latitude = $request->latitude;
            $user->save();

            return response()->json([
                'success' => true,
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erreur lors de la mise à jour de la géolocalisation: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Save quiz scores to notes
     */
    public function saveQuizScore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'quiz_num' => 'required|in:1,2',
            'score'    => 'required|numeric|min:0|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = auth()->user();

            if ($request->quiz_num == 1) {
                $user->note1 = $request->score;
            } else {
                $user->note2 = $request->score;
            }

            $user->moyenne = ($user->note1 + $user->note2) / 2;
            $user->save();

            return response()->json([
                'success' => true,
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erreur lors de l\'enregistrement des notes: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all students for statistics chart
     */
    public function stats()
    {
        try {
            $etudiants = User::select('nom', 'note1', 'note2', 'moyenne')->get();
            return response()->json([
                'success' => true,
                'data' => $etudiants
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erreur lors de la récupération des statistiques: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all students with geolocation for map
     */
    public function geolocations()
    {
        try {
            $etudiants = User::select('id', 'nom', 'longitude', 'latitude')
                ->whereNotNull('longitude')
                ->whereNotNull('latitude')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $etudiants
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erreur lors de la récupération des géolocalisations: ' . $e->getMessage()
            ], 500);
        }
    }
}