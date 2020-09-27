'use strict'

const bcrypt = require('bcrypt');//encriptar las contraseñas de los usuarios
const saltRounds = 10; //el factor de costo
const jwt = require('jsonwebtoken');//permite la creación de tokens de acceso que permiten la propagación de identidad y privilegios
//Utilizado para las imagenes
var fs = require('fs');
var path = require('path');
var isEmpty = require('lodash.isempty');//revisa si un objeto es null

var Usuario = require('../models/usuario');
var mensage = require('./glMensajeHttp');

var controller = {
    registro: (req, res) => {
        var params = req.body;

        var correo = params.correo;
        var clave = params.clave;
        var nombres = params.nombres;
        var apellidos = params.apellidos;
        if (!clave || clave == null || !correo || correo == null ||
            !nombres || nombres == null || !apellidos || apellidos == null) {
            return res.status(428).send({
                status: 'error',
                message: mensage.gl_mensages(428)
            });
        } else {
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

            Usuario.save((err, usuarioStored) => {
                if (err || isEmpty(usuarioStored)) {
                    return res.status(404).send({
                        status: 'error',
                        message: mensage.gl_mensages(404)
                    });
                } else {
                    return res.status(200).send({
                        status: 'success',
                        message: mensage.gl_mensages(200),
                        usuario: usuarioStored
                    });
                }
            });
        }
    },
    getUsuarioCorreo: (req, res) => {
        var correo = req.params.correo;

        if (!correo || correo == null) {
            return res.status(428).send({
                status: 'error',
                message: mensage.gl_mensages(428)
            });
        } else {
            const query = { correo: correo };
            Usuario.findOne(query, (err, usuario) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: mensage.gl_mensages(500)
                    });
                } else {
                    if (usuario) {
                        return res.status(200).send({
                            status: 'succes',
                            message: mensage.gl_mensages(200),
                            usuario: usuario
                        });
                    }
                    if (isEmpty(usuario)) {
                        return res.status(208).send({
                            status: 'empty',
                            message: mensage.gl_mensages(208)
                        });
                    }
                }
            });
        }
    },
    getUsuarioId: (req, res) => {
        var UsuarioId = req.params.id;

        if (!UsuarioId || UsuarioId == null) {
            return res.status(428).send({
                status: 'error',
                message: mensage.gl_mensages(428)
            });
        } else {
            const query = { _id: UsuarioId, "estado" : "activo" };
            Usuario.findOne(query, (err, usuario) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: mensage.gl_mensages(500)
                    });
                } else {
                    if (usuario) {
                        return res.status(200).send({
                            status: 'succes',
                            message: mensage.gl_mensages(200),
                            usuario: usuario
                        });
                    }
                    if (isEmpty(usuario)) {
                        return res.status(208).send({
                            status: 'empty',
                            message: mensage.gl_mensages(208)
                        });
                    }
                }
            });
        }
    },
    actualizarclave: (req, res) => {
        var UsuarioId = req.params.id;
        var clave = req.body.clave;

        if (!clave || clave == null || !UsuarioId || UsuarioId == null) {
            return res.status(428).send({
                status: 'error',
                message: mensage.gl_mensages(428)
            });
        } else {
            clave = bcrypt.hashSync(clave, saltRounds);
            const query = { _id: UsuarioId };
            const update = {
                "$set": { "clave": clave }
            };
            const options = { new: true };

            Usuario.findOneAndUpdate(query, update, options, (err) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: mensage.gl_mensages(500)
                    });
                } else {
                    return res.status(202).send({
                        status: 'succes',
                        message: mensage.gl_mensages(202)
                    });
                }
            })
        }
    },
    actualizar: (req, res) => {
        var UsuarioId = req.params.id;
        var params = req.body;

        if (!UsuarioId || UsuarioId == null ||
            !params.nombres || params.nombres == null ||
            !params.apellidos || params.apellidos == null) {
            return res.status(428).send({
                status: 'error',
                message: mensage.gl_mensages(428)
            });
        } else {
            const query = { _id: UsuarioId };
            const update = {
                "$set": {
                    "nombres": params.nombres,
                    "apellidos": params.apellidos,
                    "telefono": params.telefono,
                    "acercaMi": params.acercaMi
                }
            };
            const options = { new: true };

            Usuario.findOneAndUpdate(query, update, options, (err, usuarioUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: mensage.gl_mensages(500)
                    });
                } else {
                    if (usuarioUpdated) {
                        return res.status(200).send({
                            status: 'succes',
                            message: mensage.gl_mensages(200),
                            usuario: usuarioUpdated
                        });
                    }
                    if (isEmpty(usuarioUpdated)) {
                        return res.status(208).send({
                            status: 'empty',
                            message: mensage.gl_mensages(208)
                        });
                    }
                }
            })
        }
    },
    upload: (req, res) => {
        var UsuarioId = req.params.id;

        if (!UsuarioId || UsuarioId == null) {
            return res.status(428).send({
                status: 'error',
                message: mensage.gl_mensages(428)
            });
        } else {
            //recoger el fichero de la petición
            var file_name = 'Imagen no subida';

            //conseguir nombre y extensión
            var file_path = req.files.file.path;//utiliza file0 para hacerlo genérico,  puede tener cualquier nombre
            var path_split = file_path.split("\\"); //en unix \\ camia a /

            var file_name = path_split[2];//toma el nombre del archivo
            var ext_split = file_name.split('.');
            var file_ext = ext_split[1];

            //comprobar la extensión
            if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
                //borrar el archivo subido
                fs.unlink(file_path, (err) => {
                    return res.status(403).send({
                        status: 'error',
                        message: mensage.gl_mensages(403)
                    });
                });
            } else {
                var UsuarioId = req.params.id;

                const query = { _id: UsuarioId };
                const update = {
                    "$set": {
                        "urlFoto": file_name
                    }
                };
                const options = { new: true };

                Usuario.findOneAndUpdate(query, update, options, (err, usuarioUpdated) => {
                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: mensage.gl_mensages(500)
                        });                        

                    }else{
                        if (usuarioUpdated) {
                            return res.status(200).send({
                                status: 'succes',
                                message: mensage.gl_mensages(200),
                                usuario: usuarioUpdated
                            });
                        }
                        if (isEmpty(usuarioUpdated)) {
                            return res.status(304).send({
                                status: 'error',
                                message: mensage.gl_mensages(304)
                            });
                        }                        
                    }
                })
            }

        }
    },
    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/usuarios/' + file;

        if (!file || file == null) {
            return res.status(428).send({
                status: 'error',
                message: mensage.gl_mensages(428)
            });
        } else {       
            fs.stat(path_file, (err, stats) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: mensage.gl_mensages(500)
                    });
                } else
                    if (stats.isFile())
                        return res.sendFile(path.resolve(path_file));
            });            
        } 

    },
    getUsuarios: (req, res) => {
        var estado = req.params.estado;
        if(!estado || estado == null) estado = "activo";
        const query = { "estado" : estado };
        
        Usuario.find(query, (err, usuarios) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: mensage.gl_mensages(500)
                });
            } else {
                if (usuarios) {
                    return res.status(200).send({
                        status: 'succes',
                        message: mensage.gl_mensages(200),
                        usuarios: usuarios
                    });
                }
                if (isEmpty(usuarios)) {
                    return res.status(208).send({
                        status: 'empty',
                        message: mensage.gl_mensages(208)
                    });
                }
            }            
        });
    },
    cambiarEstado: (req, res) => {
        var UsuarioId = req.params.id;
        var estado = req.body.estado;

        if (!UsuarioId || UsuarioId == null ||
            !estado || estado == null) {
            return res.status(428).send({
                status: 'error',
                message: mensage.gl_mensages(428)
            });
        } else {
            const query = { _id: UsuarioId };
            const update = {
                "$set": {
                    "estado": estado
                }
            };
            const options = { new: true };                 

            Usuario.findOneAndUpdate(query, update, options, (err, usuarioUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: mensage.gl_mensages(500)
                    });                        

                }else{
                    if (usuarioUpdated) {
                        return res.status(200).send({
                            status: 'succes',
                            message: mensage.gl_mensages(200),
                            usuario: usuarioUpdated
                        });
                    }
                    if (isEmpty(usuarioUpdated)) {
                        return res.status(304).send({
                            status: 'error',
                            message: mensage.gl_mensages(304)
                        });
                    }                        
                }
            })            
        }        
    }
}//fin del controlador

module.exports = controller;