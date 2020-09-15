'use strict'
//archivo de modelo

var mongoose=require('mongoose');
var Schema = mongoose.Schema;
 
var FijoSchema = Schema({
    userid: String,
    obj_concepto: {
        grupo: String,
        subgrupo: String,
        concepto: String
    },
    detalle: String,
    valor : Number 
});

module.exports = mongoose.model('Fijo', FijoSchema);

 