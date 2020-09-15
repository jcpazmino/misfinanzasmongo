'use strict'
//archivos de rutas
//Express --> proporciona un conjunto sólido de características para las aplicaciones web y móviles.
var express = require('express');
var FijoController = require('../controllers/fijo');//comunicación con el controler

var router = express.Router();//middleware de nivel de direccionador

// pila de middleware de direccionador 
router.post('/save', FijoController.saveFijo);
router.get('/fijos/:last?', FijoController.getFijos); //last? --> el ? indica que el parámetro es opcional
router.get('/fijo/:id',     FijoController.getFijo); // :id--> indica que el parámetro es obligatorio
router.put('/fijo/:id',     FijoController.updateFijo);
router.delete('/fijo/:id',  FijoController.deleteFijo);
router.get('/search/:search', FijoController.searchFijo); 

module.exports = router;