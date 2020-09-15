'use strict'
//archivo de modelo

var mongoose=require('mongoose');
var Schema = mongoose.Schema;

var GrupoSchema = Schema({
    descripcion: String,
    operacion: Number,
    subgrupos: Array  
});

module.exports = mongoose.model('Grupo', GrupoSchema);
