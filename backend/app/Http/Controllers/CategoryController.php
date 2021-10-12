<?php

namespace App\Http\Controllers;

use App\Models\Category;

class CategoryController extends Controller
{
    /**
     * HTTP method : GET
     * URL : /categories
     */
    public function list()
    {
        // On va utiliser notre ORM Eloquent qui nous facilite le code :-)
        // ::all() équivalent de ::findAll()
        $categoriesList = Category::all();

        // On envoie ensuite le tout dans une réponse formattée en JSON
        return response()->json($categoriesList);
    }

    /**
     * HTTP method : GET
     * URL : /categories/{id}
     */
    public function item(int $id)
    {

        //* Avec Eloquent

        // On essaye de récupérer la catégorie qui correspond à l'id
        // Si on y arrive pas on demande a Lumen de faire une 404
        $matchingCategory = Category::findOrFail($id);
        return response()->json($matchingCategory);

        // echo "sbradavargent dans l'item";

        //* Sans Eloquent
        // $categoriesList = [
        //     1 => [
        //         'id' => 1,
        //         'name' => 'Chemin vers O\'clock',
        //         'status' => 1
        //     ],
        //     2 => [
        //         'id' => 2,
        //         'name' => 'Courses',
        //         'status' => 1
        //     ],
        //     3 => [
        //         'id' => 3,
        //         'name' => 'O\'clock',
        //         'status' => 1
        //     ],
        //     4 => [
        //         'id' => 4,
        //         'name' => 'Titre Professionnel',
        //         'status' => 1
        //     ]
        // ];

        // si la clé $id n'existe pas dans le tableau $categoriesList
        // if (!array_key_exists($id, $categoriesList)) {
        //     // Alors on déclenche une erreur 404
        //     // Rappel : abort STOPPE l'execution de la page (comme exit)
        //     abort(404);
        // }
    }
}
