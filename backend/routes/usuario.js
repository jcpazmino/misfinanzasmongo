'use strict'
//archivos de rutas
//Express --> proporciona un conjunto sólido de características para las aplicaciones web y móviles.
var express = require('express');
var UsuarioController = require('../controllers/usuario');//comunicación con el controler

var router = express.Router();//middleware de nivel de direccionador

//configurar el modulo connect multiparty para la subida del archivos
var multipart = require('connect-multiparty');//cargar el módulo
var dir_upload = multipart({ uploadDir: './upload/usuarios' });//directorio donde se cargan los archivos

//operaciones generales para la colección usuarios
router.post('/registro', UsuarioController.registro);
router.get('/usuarioCorreo/:correo?', UsuarioController.getUsuarioCorreo);
router.get('/usuarioId/:id?', UsuarioController.getUsuarioId);
router.put('/actualizar/:id?', UsuarioController.actualizar); 
router.put('/actualizarClave/:id?', UsuarioController.actualizarclave);
//cargar imagenes al servidor
router.post('/upload-image/:id?', dir_upload, UsuarioController.upload);
router.get('/get-image/:image?', UsuarioController.getImage);
//adicionales para el administrador de la BD
router.get('/usuarios/:estado?', UsuarioController.getUsuarios);
router.put('/cambiarEstado/:id?', UsuarioController.cambiarEstado);

module.exports = router;