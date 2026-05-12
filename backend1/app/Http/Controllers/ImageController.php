<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ImageController extends Controller
{
    /**
     * Get all images (metadata only)
     */
    public function index()
    {
        $images = Image::select('id', 'name', 'type', 'size')->get();
        return response()->json(['success' => true, 'data' => $images]);
    }

    /**
     * Upload and store image in DB as binary
     */
    public function store(Request $request)
    {
        // ✅ Vérifier si la requête contient un fichier
        if (!$request->hasFile('image')) {
            return response()->json([
                'success' => false,
                'error' => 'Aucun fichier image trouvé dans la requête.'
            ], 400);
        }

        $file = $request->file('image');

        // ✅ Vérifier si le fichier est valide
        if (!$file->isValid()) {
            return response()->json([
                'success' => false,
                'error' => 'Le fichier uploadé n\'est pas valide.'
            ], 400);
        }

        // ✅ Validation
        $validator = Validator::make($request->all(), [
            'image' => 'required|file|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // ✅ Lire le contenu binaire du fichier
            $binaryData = file_get_contents($file->getRealPath());

            if ($binaryData === false) {
                Log::error('Impossible de lire le fichier: ' . $file->getRealPath());
                return response()->json([
                    'success' => false,
                    'error' => 'Impossible de lire le fichier.'
                ], 500);
            }

            // ✅ Créer l'entrée dans la base de données
            $image = Image::create([
                'name'    => $file->getClientOriginalName(),
                'type'    => $file->getClientMimeType(),
                'size'    => $file->getSize(),
                'bin_img' => $binaryData,
            ]);

            return response()->json([
                'success' => true,
                'data'    => [
                    'id'   => $image->id,
                    'name' => $image->name,
                    'type' => $image->type,
                    'size' => $image->size,
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'upload de l\'image: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error'   => 'Erreur interne lors de l\'upload: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get image binary data (served as image)
     */
    public function show($id)
    {
        $image = Image::find($id);
        if (!$image) {
            return response()->json(['success' => false, 'error' => 'Image non trouvée'], 404);
        }

        return response($image->bin_img, 200)
            ->header('Content-Type', $image->type)
            ->header('Content-Disposition', 'inline; filename="' . $image->name . '"');
    }

    /**
     * Delete image
     */
    public function destroy($id)
    {
        $image = Image::find($id);
        if (!$image) {
            return response()->json(['success' => false, 'error' => 'Image non trouvée'], 404);
        }
        $image->delete();
        return response()->json(['success' => true, 'message' => 'Image supprimée']);
    }
}