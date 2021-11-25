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
        $categoriesList = Category::all();
        return response()->json($categoriesList);
    }

    /**
     * HTTP method : GET
     * URL : /categories/{id}
     */
    public function item(int $id)
    {

        //* Avec Eloquent
        $matchingCategory = Category::findOrFail($id);
        return response()->json($matchingCategory);

    }
}
