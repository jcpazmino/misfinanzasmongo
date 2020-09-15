export class Movimiento {

    constructor (
        public _id: string,
        public userid: string,
        public obj_concepto: {
            grupo: string,
            subgrupo: string,
            concepto: string
        },
        public fecha: string,
        public detalle: string, 
        public valor : number 
    ){ }
    
}
 