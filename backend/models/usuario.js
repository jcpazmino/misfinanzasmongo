'use strict'
//archivo de modelo

var mongoose=require('mongoose');
var Schema = mongoose.Schema;
 
var UsuarioSchema = Schema({
    "nombres":  String,
    "apellidos":String,
    "telefono": String,
    "acercaMi": String,
    "urlFoto":  String,
    "correo":   String,
    "clave":    String,
    "rolid":    String,
    "estado":   String,
    "fechaCreado": Date
});

module.exports = mongoose.model('Usuario', UsuarioSchema); 

 