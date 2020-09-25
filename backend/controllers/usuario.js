'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');
const bcrypt = require('bcrypt');//encriptar las contraseñas de los usuarios
const saltRounds = 10; //el factor de costo
const jwt = require('jsonwebtoken');//permite la creación de tokens de acceso que permiten la propagación de identidad y privilegios

var Usuario = require('../models/usuario');

var controller = {
    registro: (req, res) => {
        var params = req.body;

        var validate_correo = !validator.isEmpty(params.correo);
        var validate_clave = !validator.isEmpty(params.clave);
        var validate_nombres = !validator.isEmpty(params.nombres);
        var validate_apellidos = !validator.isEmpty(params.apellidos);

        if (validate_nombres && validate_apellidos && validate_correo && validate_clave) {
            var usuario = new Usuario();

            usuario.nombres = params.nombres;
            usuario.apellidos = params.apellidos;           
            usuario.telefono = '';
            usuario.acercaMi = 'Descripción de tu trabajo';
            usuario.urlFoto = './assets/img/faces/juan.jpg';
            usuario.correo = params.correo;
            usuario.clave = bcrypt.hashSync(params.clave, saltRounds);
            usuario.rolid = "web";
            usuario.estado = "activo";
            usuario.fechaCreado = new Date();

            usuario.save((err, usuarioStored) => {
                if (err || !usuarioStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El movimiento no se ha guardado'
                    });
                }
                //Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    usuario: usuarioStored
                });
            });
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son válidos'
            });
        }
    },
    updateusuario: (req, res) => {
        //Recoger parámetros por post 
        var UsuarioId = req.params.id
        var params = req.body;

        //Validar datos (validator)
        var validate_nombres = !validator.isEmpty(params.nombres);
        var validate_apellidos = !validator.isEmpty(params.apellidos);

        if (validate_nombres && validate_apellidos) {            
            Usuario.findOneAndUpdate({_id: UsuarioId}, params, {new:true}, (err, usuarioUpdated) => {
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'
                    });
                }
                if(!usuarioUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el usuario'
                    });
                }
                return res.status(200).send({
                    status: 'succes',
                    subgrupo : usuarioUpdated
                });               
            })

        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son válidos'
            });
        }
    }    

}//fin del controlador

module.exports = controller;