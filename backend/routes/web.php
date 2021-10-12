<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

//======================================
// MainController
//======================================

$router->get(
    '/',
    [
        'uses' => 'MainController@home',
        'as'   => 'main-home'
    ]
);

//======================================
// CategoryController
//======================================

$router->get(
    '/categories',
    [
        'uses' => 'CategoryController@list',
        'as'   => 'category-list'
    ]
);

$router->get(
    '/categories/{id}',
    [
        'uses' => 'CategoryController@item',
        'as'   => 'category-item'
    ]
);

//======================================
// MediaController
//======================================

$router->get(
    '/medias',
    [
        'uses' => 'MediaController@list',
        'as'   => 'media-list'
    ]
);

$router->get(
    '/medias/{id}',
    [
        'uses' => 'MediaController@item',
        'as'   => 'media-item'
    ]
);

$router->post(
    '/medias',
    [
        'uses' => 'MediaController@store',
        'as'   => 'media-store'
    ]
);

$router->put(
    '/medias/{id}',
    [
        'uses' => 'MediaController@update',
        'as'   => 'media-update-put'
    ]
);

$router->patch(
    '/medias/{id}',
    [
        'uses' => 'MediaController@update',
        'as'   => 'media-update-patch'
    ]
);

$router->delete(
    '/medias/{id}',
    [
        'uses' => 'MediaController@delete',
        'as'   => 'media-delete'
    ]
);
