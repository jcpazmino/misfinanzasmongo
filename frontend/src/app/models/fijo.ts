export class Fijo {

    constructor (
        public _id: string,
        public userid: string,
        public obj_concepto: {
            grupo: String,
            subgrupo: String,
            concepto: String
        },
        public detalle: String, 
        public valor : number 
    ){ }
    
}

