'use strict'
//archivos de rutas
//Express --> proporciona un conjunto sólido de características para las aplicaciones web y móviles.
var express = require('express');
var UsuarioController = require('../controllers/usuario');//comunicación con el controler

var router = express.Router();//middleware de nivel de direccionador

// pila de middleware de direccionador 
router.post('/save',                UsuarioController.saveusuario);
router.post('/upload-image/:id?',   md_upload, UsuarioController.upload);
router.get('/usuarios/:last?',      UsuarioController.getusuarios); //last? --> el ? indica que el parámetro es opcional
router.get('/usuario/:id',          UsuarioController.getusuario); // :id--> indica que el parámetro es obligatorio
router.put('/usuario/:id',          UsuarioController.updateusuario);
router.get('/get-image/:image',     UsuarioController.getImage);
router.delete('/usuario/:id',       UsuarioController.deleteusuario);
router.get('/search/:search',       UsuarioController.searchusuario); 
router.get('/searchCorreo/:correo', UsuarioController.searchcorreo); 

module.exports = router;