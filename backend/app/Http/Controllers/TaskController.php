<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TaskController extends Controller
{
    /**
     * HTTP method : GET
     * URL : /tasks
     */
    public function list()
    {
        return response()->json(Task::all()->load('category'));
    }

    /**
     * HTTP method : GET
     * URL : /tasks/{id}
     */
    public function item(int $id)
    {
        $matchingTask = Task::findOrFail($id);
        return response()->json($matchingTask);
    }

    /**
     * HTTP method : POST
     * URL : /tasks
     */
    public function store(Request $request)
    {
        // Je crée un nouvel objet pour ma classe Task(ma classe task contient tous les paramètres de ma bdd grâce à Lumen)
        $newTask = new Task;

        // Je récupère les donnée envoyé en POST
        $title = $request->input('title');
        $categoryId = $request->input('categoryId');

        // J'envoie les données stoqué dans le paramètre
        $newTask->title = $title;
        $newTask->category_id = $categoryId;

        // Certains champs sont optionnels, on vérifie si ils ont été fournis
        if ($request->filled('completion')) {
            $newTask->completion = $request->input('completion');
        }
        if ($request->filled('status')) {
            $newTask->status = $request->input('status');
        }

        // Je le sauvegarde
        // ->save nous renvoi un booléen indiquant si l'ajout en BDD a fonctionné
        $isInserted = $newTask->save();

        // Je veux également récupérer les infos de la catégorie associée
        $newTask->load('category');

        if ($isInserted) { // Si l'ajout a fonctionné
            return response()->json($newTask, Response::HTTP_CREATED);
        } else {
            // On répond avec une réponse vide (pas de JSON)
            // Et un code HTTP 500 (Internal Server Error)
            return response("", Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * HTTP method : PUT, PATCH
     * URL : /tasks/{id}
     */
    public function update(Request $request, int $id)
    {
        // On récupère la tâche à modifier et on déclenche une 404 si elle n'existe pas
        $taskToUpdate = Task::findOrFail($id);

        // Est-ce que la raquête utilise la méthode PUT ?
        if ($request->isMethod('put')) {
            // On vérifie que les données à mettre à jour sont présente
            if ($request->filled(['title', 'categoryId', 'completion', 'status'])) {
                // Si c'est bon, on met à jour notre object
                $taskToUpdate->title        = $request->input("title");
                $taskToUpdate->category_id  = $request->input("categoryId");
                $taskToUpdate->completion   = $request->input("completion");
                $taskToUpdate->status       = $request->input("status");
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
                $taskToUpdate->title = $request->input('title');
                $oneDataAtLeast = true;
            }
            if ($request->filled('categoryId')) {
                $taskToUpdate->category_id = $request->input('categoryId');
                $oneDataAtLeast = true;
            }
            if ($request->filled('completion')) {
                $taskToUpdate->completion = $request->input('completion');
                $oneDataAtLeast = true;
            }
            if ($request->filled('status')) {
                $taskToUpdate->status = $request->input('status');
                $oneDataAtLeast = true;
            }

            // Si on n'a pas reçu au moins une donnée concertant notre Task
            if ($oneDataAtLeast === false) {
                // On retourne un réponse vide avec un code réponse 400(Bad Request)
                return response("", Response::HTTP_BAD_REQUEST);
            }
        }
        // Si on arrive ici, c'est qu'on a rencontré aucune erreur BAD_REQUEST
        // Donc on sauvegarde le tâche modifiée en BDD
        if ($taskToUpdate->save()) {
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
        $taskToDelete = Task::findOrFail($id);

        if (!empty($taskToDelete)) {

            $deletedTask = $taskToDelete->delete();
            // On vérifie que le delete a bien fonctionné
            if ($deletedTask === true) {
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
