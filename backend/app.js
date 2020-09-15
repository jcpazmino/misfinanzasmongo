'use strict'

//Cargar módulos de node para crear servidor
var express  = require('express');
var bodyParser = require('body-parser');

//ejecutar express para trabajar con HTTP
var app = express();

//cargar ficheros rutas 
var fijo_routes     = require('./routes/fijo');
var grupo_routes    = require('./routes/grupo');
var movimiento_routes = require('./routes/movimiento');
var subgrupo_routes = require('./routes/subgrupo');

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//CORS para permitir peticiones desde el front
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//añadir prefijos a rutas / cargar rutas
app.use('/api/fijo',       fijo_routes);
app.use('/api/grupo',       grupo_routes);
app.use('/api/movimiento', movimiento_routes);
app.use('/api/subgrupo',    subgrupo_routes);

//exportar módulo (fichero actual)
module.exports = app;
