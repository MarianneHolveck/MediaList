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

        $newMedia = new Media;


        $title = $request->input('title');
        $categoryId = $request->input('categoryId');

        $newMedia->title = $title;
        $newMedia->category_id = $categoryId;

        if ($request->filled('status')) {
            $newMedia->status = $request->input('status');
        }

        // Je le sauvegarde
        $isInserted = $newMedia->save();

        $newMedia->load('category');

        if ($isInserted) { // Si l'ajout a fonctionné
            return response()->json($newMedia, Response::HTTP_CREATED);
        } else {

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

            $oneDataAtLeast = false;

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

        if ($mediaToUpdate->save()) {
            return response('', Response::HTTP_NO_CONTENT);
        } else {

            return response('', Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function delete(Request $request, int $id)
    {
        $mediaToDelete = Media::findOrFail($id);

        if (!empty($mediaToDelete)) {

            $deletedMedia = $mediaToDelete->delete();
            if ($deletedMedia === true) {
                return response("", Response::HTTP_NO_CONTENT);
            } else {
                return response("", Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        } else
        {
            return response("", Response::HTTP_NOT_FOUND);
        }
    }
}
