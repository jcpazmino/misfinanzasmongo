'use strict'
//archivo de control
var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Subgrupo = require('../models/subgrupo');

var controller = {    
    saveSubgrupo: (req, res) => {
        //Recoger parámetros por post
        var params = req.body;
        
        //Validar datos (validator)
        try{
            var validate_descripcion = !validator.isEmpty(params.descripcion);
            var validate_conceptos= !validator.isEmpty(params.conceptos);
        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if(validate_descripcion && validate_conceptos ){
            //Crear el objeto a guardar
            var subgrupo = new Subgrupo();

            //Asignar valores
            subgrupo.descripcion = params.descripcion;
            subgrupo.conceptos = params.conceptos.split(",");

            //Guarda el artículo
            subgrupo.save((err, subgrupoStored) => {

                if(err || !subgrupoStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El subgrupo no se ha guardado'
                    });                     
                }
                //Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    subgrupo : subgrupoStored
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

    getSubgrupos: (req, res) => {
        var query = Subgrupo.find({});
        //last-->parámetro de consulta--- opcional, declarado en routes
        var last = req.params.last;
        if(last || last!=undefined){
            query.limit(5);
        }
        //Sacar los datos de la base de datos
        //-_id ordena los artículos descendentemente del mas nuevo al mas viejo
        query.sort('-_id').exec((err, subgrupos) =>{
           
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error de consulta de datos'
                }); 
            }
            if(!subgrupos){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay datos para la consulta'
                }); 
            }            
            return res.status(200).send({
                status: 'succes',
                subgrupos
            });             
        })
        
    },
    getSubgrupo: (req, res) => {
        var SubgrupoId = req.params.id;
        if(!SubgrupoId || SubgrupoId==null){
            return res.status(404).send({
                status: 'error',
                message: 'No hay datos para la consulta'
            });
        }
        Subgrupo.findById(SubgrupoId, (err, subgrupo) => {
            
            if(err || !subgrupo){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe subgrupo'
                });
            }
            return res.status(200).send({
                status: 'succes',
                subgrupo
            });  
        });
    },
    updateSubgrupo: (req, res) => {
        //recoger datos
        var SubgrupoId = req.params.id; //llega por la url
        var params = req.body; //datos para actualización, llegan por el protocolo http
        var validate_descripcion = !validator.isEmpty(params.descripcion);
        var validate_conceptos= !validator.isEmpty(params.conceptos);
 
        if(validate_descripcion && validate_conceptos){
            //Asignar valores
            params.conceptos = params.conceptos.split(","); 

            Subgrupo.findOneAndUpdate({_id: SubgrupoId}, params, {new:true}, (err, subgrupoUpdated) => {
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'
                    });
                }
                if(!subgrupoUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el subgrupo'
                    });
                }
                return res.status(200).send({
                    status: 'succes',
                    subgrupo : subgrupoUpdated
                });                 
            });
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'La validación no es correcta'
            });
        }
    },
    deleteSubgrupo: (req, res) => {  
        var SubgrupoId = req.params.id; //llega por la url
        Subgrupo.findByIdAndDelete({_id: SubgrupoId}, (err, subgrupoRemoved) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al Borrar'
                });
            }
            if(!subgrupoRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el subgrupo, posiblemente no exista'
                });
            }else{
                return res.status(200).send({
                    status: 'succes',
                    subgrupo : subgrupoRemoved
                });
            }
        });
    },
    
    searchsubgrupo: (req, res) => {
        var searchString = req.params.search;

        //Si lo que estoy buscando esta dentro alguno de los campos
        Subgrupo.find({'$or': [
            {descripcion: {'$regex': searchString, '$options': 'i'}},
            {conceptos: {'$regex': searchString, '$options': 'i'}}
        ]})
        .exec((err, subgrupos) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error  en la petición'
                });               
            }
            if(subgrupos.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay subgrupos que coincidan con la búsqueda'
                });               
            }
            return res.status(200).send({
                status: 'succes',
                subgrupos
            });
        });
    } 
//falta realizar el llamado a grupo cuando se actualice o borre un subgrupo  
};//fin del controlador

module.exports = controller;