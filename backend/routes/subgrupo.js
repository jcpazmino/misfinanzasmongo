'use strict'
//archivos de rutas
//Express --> proporciona un conjunto sólido de características para las aplicaciones web y móviles.
var express = require('express');
var SubgrupoController = require('../controllers/subgrupo');//comunicación con el controler

var router = express.Router();//middleware de nivel de direccionador

// pila de middleware de direccionador 
router.post('/save', SubgrupoController.saveSubgrupo);
router.get('/subgrupos/:last?', SubgrupoController.getSubgrupos); //last? --> el ? indica que el parámetro es opcional
router.get('/subgrupo/:id', SubgrupoController.getSubgrupo); // :id--> indica que el parámetro es obligatorio
router.put('/subgrupo/:id', SubgrupoController.updateSubgrupo);
router.delete('/subgrupo/:id', SubgrupoController.deleteSubgrupo);
router.get('/search/:search', SubgrupoController.searchsubgrupo);

module.exports = router;