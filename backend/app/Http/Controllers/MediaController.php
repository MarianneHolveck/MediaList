<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MediaController extends Controller
{
    /**
     * HTTP method : GET
     * URL : /medias
     */
    public function list()
    {
        return response()->json(Media::all()->load('category'));
    }

    /**
     * HTTP method : GET
     * URL : /medias/{id}
     */
    public function item(int $id)
    {
        $matchingMedia = Media::findOrFail($id);
        return response()->json($matchingMedia);
    }

    /**
     * HTTP method : POST
     * URL : /medias
     */
    public function store(Request $request)
    {
        // Je crée un nouvel objet pour ma classe Meida(ma classe media contient tous les paramètres de ma bdd grâce à Lumen)
        $newMedia = new Media;

        // Je récupère les donnée envoyé en POST
        $title = $request->input('title');
        $categoryId = $request->input('categoryId');

        // J'envoie les données stoqué dans le paramètre
        $newMedia->title = $title;
        $newMedia->category_id = $categoryId;

        // Certains champs sont optionnels, on vérifie si ils ont été fournis
        if ($request->filled('status')) {
            $newMedia->status = $request->input('status');
        }

        // Je le sauvegarde
        // ->save nous renvoi un booléen indiquant si l'ajout en BDD a fonctionné
        $isInserted = $newMedia->save();

        // Je veux également récupérer les infos de la catégorie associée
        $newMedia->load('category');

        if ($isInserted) { // Si l'ajout a fonctionné
            return response()->json($newMedia, Response::HTTP_CREATED);
        } else {
            // On répond avec une réponse vide (pas de JSON)
            // Et un code HTTP 500 (Internal Server Error)
            return response("", Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * HTTP method : PUT, PATCH
     * URL : /medias/{id}
     */
    public function update(Request $request, int $id)
    {
        // On récupère la tâche à modifier et on déclenche une 404 si elle n'existe pas
        $mediaToUpdate = Media::findOrFail($id);

        // Est-ce que la raquête utilise la méthode PUT ?
        if ($request->isMethod('put')) {
            // On vérifie que les données à mettre à jour sont présente
            if ($request->filled(['title', 'categoryId', 'status'])) {
                // Si c'est bon, on met à jour notre object
                $mediaToUpdate->title        = $request->input("title");
                $mediaToUpdate->category_id  = $request->input("categoryId");
                $mediaToUpdate->status       = $request->input("status");
            } else {
                // On retourne une réponse vide avec un code réponse 400 (Bad Request)
                return response("", Response::HTTP_BAD_REQUEST);
            }
        } else //Sinon, c'est PATCH
        {
            // On va stocker dans une variable le fait qu'il y ait au moins
            // une des 4 informations fournies
            $oneDataAtLeast = false; // on part du principe qu'il n'y a aucune
            // information de fournie

            // Pour chaque propriété, on regarde si l'information est fournie
            // si c'est le cas, alors on met à jour la tâche pour cette propriété
            // et on est sûr qu'il y a au moins une information mise à jour
            if ($request->filled('title')) {
                $mediaToUpdate->title = $request->input('title');
                $oneDataAtLeast = true;
            }
            if ($request->filled('categoryId')) {
                $mediaToUpdate->category_id = $request->input('categoryId');
                $oneDataAtLeast = true;
            }
            if ($request->filled('status')) {
                $mediaToUpdate->status = $request->input('status');
                $oneDataAtLeast = true;
            }

            // Si on n'a pas reçu au moins une donnée concertant notre Media
            if ($oneDataAtLeast === false) {
                // On retourne un réponse vide avec un code réponse 400(Bad Request)
                return response("", Response::HTTP_BAD_REQUEST);
            }
        }
        // Si on arrive ici, c'est qu'on a rencontré aucune erreur BAD_REQUEST
        // Donc on sauvegarde le tâche modifiée en BDD
        if ($mediaToUpdate->save()) {
            // On va faire mieux que l'énoncé et répondre avec un code 204
            // Ce dernier indique "la réponse est vide mais c'est normal lol

            return response('', Response::HTTP_NO_CONTENT);
        } else {
            // Si la sauvegarde n'a pas fonctionné, on renvoi un erreur 500
            return response('', Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function delete(Request $request, int $id)
    {
        // On récupère la tâche à modifier et on déclenche une 404 si elle n'existe pas
        $mediaToDelete = Media::findOrFail($id);

        if (!empty($mediaToDelete)) {

            $deletedMedia = $mediaToDelete->delete();
            // On vérifie que le delete a bien fonctionné
            if ($deletedMedia === true) {
                return response("", Response::HTTP_NO_CONTENT);
            } else {
                // On retourne une réponse vide avec un code réponse 400 (Bad Request)
                return response("", Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        } else
        {
            // On retourne un réponse vide avec un code réponse 400(Bad Request)
            return response("", Response::HTTP_NOT_FOUND);
        }
    }
}
