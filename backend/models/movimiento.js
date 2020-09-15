'use strict'
//archivo de modelo

var mongoose=require('mongoose');
var Schema = mongoose.Schema;

var MovimientoSchema = Schema({
    userid: String,
    obj_concepto: {
        grupo: String,
        subgrupo: String,
        concepto: String 
    },
    fecha: String,
    detalle: String,
    valor : Number
});

module.exports = mongoose.model('Movimiento', MovimientoSchema);

 