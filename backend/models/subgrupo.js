'use strict'
//archivo de modelo

var mongoose=require('mongoose');
var Schema = mongoose.Schema;

var SubgrupoSchema = Schema({
    descripcion: String,
    conceptos: Array 
});

module.exports = mongoose.model('Subgrupo', SubgrupoSchema);
