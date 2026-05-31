<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    protected $table = 'etudiants';
    public $timestamps = false;  // ← désactive created_at / updated_at

    protected $fillable = [
        'login',
        'pass',
        'nom',
        'note1',
        'note2',
        'moyenne',
        'longitude',
        'latitude',
    ];

    protected $hidden = [
        'pass',
    ];

    public function getAuthPassword()
    {
        return $this->pass;
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}