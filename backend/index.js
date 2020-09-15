;'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3000;

// mongoose.set('useFindAnModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/misfinanzas', {userNewUrlParser: true, useFindAndModify: false })
        .then(() => {
            console.log('Conexión BD correcta');

            //crear servidor y esperar peticiones HTTP
            app.listen(port, () => {
                console.log('servidor en http://localhost:'+port);

            });

        })