'use strict'
//archivos de rutas
//Express --> proporciona un conjunto sólido de características para las aplicaciones web y móviles.
var express = require('express');
var GrupoController = require('../controllers/grupo');//comunicación con el controler

var router = express.Router();//middleware de nivel de direccionador

// pila de middleware de direccionador 
router.post('/save', GrupoController.saveGrupo);
router.get('/grupos/:last?', GrupoController.getGrupos); //last? --> el ? indica que el parámetro es opcional
router.get('/grupo/:id', GrupoController.getGrupo); // :id--> indica que el parámetro es obligatorio
router.put('/grupo/:id', GrupoController.updateGrupo);
router.delete('/grupo/:id', GrupoController.deleteGrupo);
router.get('/search/:search', GrupoController.searchGrupo);

module.exports = router;