'use strict'
//archivo de control
var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Movimiento = require('../models/movimiento');

var controller = {    
    saveMovimiento: (req, res) => {
        //Recoger parámetros por post 
        var params = req.body;

        //Validar datos (validator)
        var validate_userid     =   !validator.isEmpty(params.userid);
        var validate_fecha      =   !validator.isEmpty(params.fecha);
        var validate_grupo      =   !validator.isEmpty(params.obj_concepto.grupo);       
        var validate_subgrupo   =   !validator.isEmpty(params.obj_concepto.subgrupo);       
        var validate_concepto   =   !validator.isEmpty(params.obj_concepto.concepto);
        
        if(validate_fecha && validate_userid && validate_grupo && validate_subgrupo && validate_concepto){
            //Crear el objeto a guardar
            var movimiento = new Movimiento();

            //Asignar valores
            movimiento.userid   =    params.userid;
            movimiento.fecha    =    params.fecha;
            movimiento.obj_concepto =   {
                grupo :     params.obj_concepto.grupo,
                subgrupo :  params.obj_concepto.subgrupo,
                concepto :  params.obj_concepto.concepto
            }
            movimiento.detalle  =    params.detalle;
            movimiento.valor    =    params.valor;

            //Guarda el movimiento
            movimiento.save((err, movimientoStored) => { 

                if(err || !movimientoStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El movimiento no se ha guardado'
                    });                     
                }
                //Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    movimiento : movimientoStored
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

    getMovimientos: (req, res) => {
        var query = Movimiento.find({});
        //last-->parámetro de consulta--- opcional, declarado en routes
        var last = req.params.last;
        if(last || last!=undefined){
            query.limit(5);
        }
        //Sacar los datos de la base de datos
        //-_id ordena los artículos descendentemente del mas nuevo al mas viejo
        query.sort('-_id').exec((err, movimientos) =>{ 
            
            if(err){ 
                return res.status(500).send({
                    status: 'error',
                    message: 'Error de consulta de datos'
                }); 
            }
            if(!movimientos){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay datos para la consulta'
                }); 
            }            
            return res.status(200).send({
                status: 'succes',
                movimientos
            });             
        })
        
    },
    
    getMovimiento: (req, res) => {
        var MovimientoId = req.params.id;
        if(!MovimientoId || MovimientoId==null){
            return res.status(404).send({
                status: 'error',
                message: 'No hay datos para la consulta'
            });
        }
        Movimiento.findById(MovimientoId, (err, movimiento) => {
            
            if(err || !movimiento){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe movimiento'
                });
            }
            return res.status(200).send({
                status: 'succes',
                movimiento
            });  
        });
    },
   
    updateMovimiento: (req, res) => {
        //recoger datos
        var MovimientoId = req.params.id; //llega por la url
        var params = req.body; //datos para actualización, llegan por el protocolo http
        //var validate_userid     =   !validator.isEmpty(params.userid);
        var validate_grupo      =   !validator.isEmpty(params.obj_concepto.grupo);       
        var validate_subgrupo   =   !validator.isEmpty(params.obj_concepto.subgrupo);       
        var validate_concepto   =   !validator.isEmpty(params.obj_concepto.concepto);
        //var validate_fecha      =   !validator.isEmpty(params.fecha);
        //var validate_valor      =   !validator.isEmpty(params.valor);
        params._id = MovimientoId;
 
        if(validate_grupo && validate_subgrupo && validate_concepto ){ 
            Movimiento.findOneAndUpdate({_id: MovimientoId}, params, {new:true}, (err, movimientoUpdated) => {
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'
                    });
                }
                if(!movimientoUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el movimiento'
                    });
                }
                return res.status(200).send({
                    status: 'succes update',
                    movimiento : movimientoUpdated
                });                 
            });
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'La validación no es correcta'
            });
        }
    },
     
    deleteMovimiento: (req, res) => { 
        var MovimientoId = req.params.id; //llega por la url
        Movimiento.findByIdAndDelete({_id: MovimientoId}, (err, movimientoRemoved) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al Borrar'
                });
            }
            if(!movimientoRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el movimiento, posiblemente no exista'
                });
            }else{
                return res.status(200).send({
                    status: 'succes',
                    movimiento : movimientoRemoved
                });
            }
        });
    },

    searchMovimiento: (req, res) => {
        var searchString = req.params.search;

        Movimiento.find({'$or': [
            //Si lo que estoy buscando esta dentro alguno de los campos
            {userid: {'$regex': searchString, '$options': 'i'}},
            {fecha: {'$regex': searchString, '$options': 'i'}},
            {"obj_concepto.grupo": {'$regex': searchString, '$options': 'i'}},
            {"obj_concepto.subgrupo": {'$regex': searchString, '$options': 'i'}},
            {"obj_concepto.concepto": {'$regex': searchString, '$options': 'i'}},
            {detalle: {'$regex': searchString, '$options': 'i'}}
        ]})
        .exec((err, movimientos) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error  en la petición'
                });               
            }
            if(!movimientos){
                return res.status(200).send({
                    status: 'succes',
                    message: 'No hay movimientos que coincidan con la búsqueda'
                });               
            }
            return res.status(200).send({
                status: 'succes',
                movimientos
            });
        });
    },
    
    searchMovFechaConcepto: (req, res) => {
        var searchString = req.params.search.split(';;');
        var fecha = searchString[0];
        var concepto = searchString[1];

        Movimiento.find({'$and': [
            {fecha: {'$regex': fecha, '$options': 'i'}},
            {"obj_concepto.concepto": {'$regex': concepto, '$options': 'i'}},
       ]})
       .exec((err, movimientos) => {
           if(err){
               return res.status(500).send({
                   status: 'error',
                   message: 'Error  en la petición'
               });               
           }
           if(!movimientos){
               return res.status(200).send({
                   status: 'succes',
                   message: 'No hay movimientos que coincidan con la búsqueda'
               });               
           }
           return res.status(200).send({
               status: 'succes',
               movimientos
           });
       });
    },
    
    searchMovFechaGrupo: (req, res) => {
        var searchString = req.params.search.split(';;');
        var fecha = searchString[0];
        var grupo = searchString[1];

        Movimiento.find({'$and': [
            {fecha: {'$regex': fecha, '$options': 'i'}},
            {"obj_concepto.grupo": {'$regex': grupo, '$options': 'i'}},
        ]})
        .exec((err, movimientos) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error  en la petición' 
                });               
            }
            if(!movimientos){
                return res.status(200).send({
                    status: 'success',
                    message: 'No Hay movimiviento para, fecha:'+fecha+'grupo:'+grupo
                });               
            }
            return res.status(200).send({
                status: 'succes',
                movimientos
            });
        });
    }
};//fin del controlador

module.exports = controller;