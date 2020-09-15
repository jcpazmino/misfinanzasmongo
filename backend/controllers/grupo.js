'use strict'
//archivo de control
var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Grupo = require('../models/grupo');

var controller = {    
    saveGrupo: (req, res) => { 
        //Recoger parámetros por post
        var params = req.body;
        
        //Validar datos (validator)
        try{
            var validate_descripcion = !validator.isEmpty(params.descripcion);
            var validate_operacion= !validator.isEmpty(params.operacion);
        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if(validate_descripcion && validate_operacion){
            //Crear el objeto a guardar
            var grupo = new Grupo();

            //Asignar valores
            grupo.descripcion = params.descripcion;
            grupo.operacion = params.operacion;

            //Guarda el artículo 
            grupo.save((err, grupoStored) => {

                if(err || !grupoStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El grupo no se ha guardado'
                    });                     
                }
                //Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    grupo : grupoStored
                });               
            });
        }
        else{
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son válidos'
            });             
        }
    },

    getGrupos: (req, res) => {
        var query = Grupo.find({});
        //last-->parámetro de consulta--- opcional, declarado en routes
        var last = req.params.last;
        if(last || last!=undefined){
            query.limit(5);
        }
        //Sacar los datos de la base de datos
        //-_id ordena los artículos descendentemente del mas nuevo al mas viejo
        query.sort('-_id').exec((err, grupos) =>{
           
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error de consulta de datos'
                }); 
            }
            if(!grupos){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay datos para la consulta'
                }); 
            }            
            return res.status(200).send({
                status: 'succes',
                grupos
            });             
        })
        
    },
    getGrupo: (req, res) => {
        var GrupoId = req.params.id;
        if(!GrupoId || GrupoId==null){
            return res.status(404).send({
                status: 'error',
                message: 'No hay datos para la consulta'
            });
        }
        Grupo.findById(GrupoId, (err, grupo) => {
            
            if(err || !grupo){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe grupo'
                });
            }
            return res.status(200).send({
                status: 'succes',
                grupo
            });  
        });
    },
    updateGrupo: (req, res) => { 
        //recoger datos
        var GrupoId = req.params.id; //llega por la url
        var params = req.body; //datos para actualización, llegan por el protocolo http
        var validate_descripcion = !validator.isEmpty(params.descripcion);
        var validate_operacion= !validator.isEmpty(params.operacion);
 
        if(validate_descripcion && validate_operacion ){
            Grupo.findOneAndUpdate({_id: GrupoId}, params, {new:true}, (err, grupoUpdated) => {
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'
                    });
                }
                if(!grupoUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el grupo'
                    });
                }
                return res.status(200).send({
                    status: 'succes',
                    grupo : grupoUpdated
                });                 
            });
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'La validación no es correcta'
            });
        }
    },
    deleteGrupo: (req, res) => { 
        var GrupoId = req.params.id; //llega por la url
        Grupo.findByIdAndDelete({_id: GrupoId}, (err, grupoRemoved) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al Borrar'
                });
            }
            if(!grupoRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el grupo, posiblemente no exista'
                });
            }else{
                return res.status(200).send({
                    status: 'succes',
                    grupo : grupoRemoved
                });
            }
        });
    },
    
    searchGrupo: (req, res) => {
        var searchString = req.params.search; 

        //Si lo que estoy buscando esta dentro alguno de los campos
        Grupo.find({'$or': [ 
            {descripcion: {'$regex': searchString, '$options': 'i'}},
            {subgrupos: {'$regex': searchString, '$options': 'i'}}
        ]})
        .exec((err, grupos) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error  en la petición'
                });               
            }
            if(grupos.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay grupos que coincidan con la búsqueda'
                });               
            }
            return res.status(200).send({
                status: 'succes',
                grupos
            });
        });
    }  
//quedan faltando los métodos para adicionar y borrar subgrupos
//estos deberán ser llamados cada que se adicione, modifique o borre un subgrupo
 
};//fin del controlador



module.exports = controller;