'use strict'
//archivo de control
var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Fijo = require('../models/fijo');

var controller = {    
    saveFijo: (req, res) => { 
        //Recoger parámetros por post 
        var params = req.body; 

        //Validar datos (validator)
        var validate_userid     =   !validator.isEmpty(params.userid);
        var validate_grupo      =   !validator.isEmpty(params.obj_concepto.grupo);       
        var validate_subgrupo   =   !validator.isEmpty(params.obj_concepto.subgrupo);       
        var validate_concepto   =   !validator.isEmpty(params.obj_concepto.concepto);
        
        if(validate_userid && validate_grupo && validate_subgrupo && validate_concepto){
            //Crear el objeto a guardar
            var fijo = new Fijo();

            //Asignar valores
            fijo.userid   =    params.userid;
            fijo.obj_concepto =   {
                grupo :     params.obj_concepto.grupo,
                subgrupo :  params.obj_concepto.subgrupo,
                concepto :  params.obj_concepto.concepto
            };
            fijo.detalle  =    params.detalle;
            fijo.valor    =    params.valor;

            //Guarda el movimiento
            fijo.save((err, fijoStored) => {

                if(err || !fijoStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El movimiento no se ha guardado'
                    });                     
                }
                //Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    fijo : fijoStored
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

    getFijos: (req, res) => {
        var query = Fijo.find({});
        //last-->parámetro de consulta--- opcional, declarado en routes
        var last = req.params.last;
        if(last || last!=undefined){
            query.limit(5);
        }
        //Sacar los datos de la base de datos
        //-_id ordena los artículos descendentemente del mas nuevo al mas viejo
        query.sort('-_id').exec((err, fijos) =>{
            
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error de consulta de datos'
                }); 
            }
            if(!fijos){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay datos para la consulta'
                }); 
            }            
            return res.status(200).send({
                status: 'succes',
                fijos
            });             
        })
        
    },
    
    getFijo: (req, res) => {
        var FijoId = req.params.id;
        if(!FijoId || FijoId==null){
            return res.status(404).send({
                status: 'error',
                message: 'No hay datos para la consulta'
            });
        }
        Fijo.findById(FijoId, (err, fijo) => {
            
            if(err || !fijo){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe movimiento'
                });
            }
            return res.status(200).send({
                status: 'succes',
                fijo
            });  
        });
    },
   
    updateFijo: (req, res) => {
        var mongoose = require('mongoose');
        var FijoId = mongoose.Types.ObjectId(req.params.id);
        //recoger datos
        var params = req.body;
        var params = req.body; //datos para actualización, llegan por el protocolo http
        var validate_userid     =   !validator.isEmpty(params.userid);
        var validate_grupo      =   !validator.isEmpty(params.obj_concepto.grupo);       
        var validate_subgrupo   =   !validator.isEmpty(params.obj_concepto.subgrupo);       
        var validate_concepto   =   !validator.isEmpty(params.obj_concepto.concepto);
        params._id = FijoId;

        if(validate_userid && validate_grupo && validate_subgrupo && validate_concepto){
            
            Fijo.findOneAndUpdate({ _id: FijoId }, params, {new:true}, (err, fijoUpdated) => {
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'
                    });
                }
                if(!fijoUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el movimiento'
                    });
                }
                return res.status(200).send({
                    status: 'succes',
                    fijo : fijoUpdated
                });                 
            }); 
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'La validación no es correcta'
            });
        }
    },
     
    deleteFijo: (req, res) => { 
        var FijoId = req.params.id; //llega por la url
        Fijo.findByIdAndDelete({_id: FijoId}, (err, fijoRemoved) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al Borrar'
                });
            }
            if(!fijoRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el movimiento, posiblemente no exista'
                });
            }else{
                return res.status(200).send({
                    status: 'succes',
                    fijo : fijoRemoved
                });
            }
        });
    },

    searchFijo: (req, res) => {
        var searchString = req.params.search;

        Fijo.find({'$or': [
            //Si lo que estoy buscando esta dentro alguno de los campos
            {userid: {'$regex': searchString, '$options': 'i'}},
            {"obj_concepto.grupo": {'$regex': searchString, '$options': 'i'}},
            {"obj_concepto.subgrupo": {'$regex': searchString, '$options': 'i'}},
            {"obj_concepto.concepto": {'$regex': searchString, '$options': 'i'}},
            {detalle: {'$regex': searchString, '$options': 'i'}}
        ]})
        .exec((err, Fijos) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error  en la petición'
                });               
            }
            if(Fijos.length <= 0){
                return res.status(404).send({ 
                    status: 'error',
                    message: 'No hay movimientos que coincidan con la búsqueda'
                });               
            }
            return res.status(200).send({
                status: 'succes',
                Fijos
            });
        });
    }   
};//fin del controlador

module.exports = controller;