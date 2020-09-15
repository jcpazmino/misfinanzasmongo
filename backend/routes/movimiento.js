'use strict'
//archivos de rutas
//Express --> proporciona un conjunto sólido de características para las aplicaciones web y móviles.
var express = require('express');
var MovimientoController = require('../controllers/movimiento');//comunicación con el controler

var router = express.Router();//middleware de nivel de direccionador

// pila de middleware de direccionador 
router.post('/save', MovimientoController.saveMovimiento);
router.get('/movimientos/:last?', MovimientoController.getMovimientos); //last? --> el ? indica que el parámetro es opcional
router.get('/movimiento/:id', MovimientoController.getMovimiento); // :id--> indica que el parámetro es obligatorio
router.put('/movimiento/:id', MovimientoController.updateMovimiento);
router.delete('/movimiento/:id', MovimientoController.deleteMovimiento);
router.get('/search/:search', MovimientoController.searchMovimiento);
router.get('/searchMovFechaConcepto/:search', MovimientoController.searchMovFechaConcepto);
router.get('/searchMovFechaGrupo/:search', MovimientoController.searchMovFechaGrupo);

module.exports = router;