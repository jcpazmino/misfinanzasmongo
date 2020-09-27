exports.gl_mensages = function (indice) {
    nombreColeccion = 'Usuario';
    global.Gl_MensajesHttp = new Array();

    Gl_MensajesHttp[100] =	"Seguir";
    Gl_MensajesHttp[101] =	"Protocolos de conmutación";
    Gl_MensajesHttp[100] =	"Procesando";
    //****** */
    Gl_MensajesHttp[200] =	"Operación exitosa";
    Gl_MensajesHttp[201] =	"Registro creado";
    Gl_MensajesHttp[202] =	"Registro actualizado";
    Gl_MensajesHttp[203] =	"Información no autorizada";
    //Gl_MensajesHttp[204] =	"Registro no existe";//detiene el proceso... no utilizado
    Gl_MensajesHttp[205] =	"Restablecer contenido";
    Gl_MensajesHttp[206] =	"Contenido parcial";
    Gl_MensajesHttp[207] =	"Multi-estado";
    Gl_MensajesHttp[208] =	"Regitro no existe";
    //****** */
    Gl_MensajesHttp[300] =	"Múltiples opciones";
    Gl_MensajesHttp[301] =	"Movido permanentemente";
    Gl_MensajesHttp[302] =	"Mudado temporalmente";
    Gl_MensajesHttp[303] =	"Ver otros";
    Gl_MensajesHttp[304] =	"Registo no modificado";
    Gl_MensajesHttp[305] =	"Usa proxy"; 
    Gl_MensajesHttp[307] =	"Redireccionamiento temporal";
    Gl_MensajesHttp[308] =	"Redirección permanente";
    //****** */
    Gl_MensajesHttp[403] =	"Tipo de archivo, no válido";
    Gl_MensajesHttp[404] =	"El registro no se ha guardado";
    Gl_MensajesHttp[428] =	"Faltan datos para la operación";
    //****** */
    Gl_MensajesHttp[500] =	"Registro no encontrado";


    return Gl_MensajesHttp[indice];
  };
/* 400	Solicitud incorrecta
401	No autorizado
402	pago requerido
403	Prohibido
404	Extraviado
405	Método no permitido
406	Inaceptable
407	Se requiere autenticación proxy
408	Pide tiempo fuera
409	Conflicto
410	Ido
411	Longitud requerida
412	Condición previa Falló
413	Solicitar entidad demasiado grande
414	Request-URI demasiado largo
415	Tipo de papel no admitido
416	Rango solicitado no satisfactorio
417	Expectativa fallida
418	Soy una tetera
419	Espacio insuficiente en recursos
420	Fallo del método
422	Entidad no procesable
423	Bloqueado
424	Dependencia fallida
428	Requisito previo
429	Demasiadas solicitudes
431	Campos de encabezado de solicitud demasiado grandes
451	No disponible por motivos legales
 */
