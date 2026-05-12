<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => 'Master RSI API - Langage du Web', 'version' => '1.0']);
});
