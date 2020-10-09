export class Usuario {
    constructor (
        public _id: string,
        public nombres:  String,
        public apellidos:String,
        public telefono: String,
        public acercaMi: String,
        public urlFoto:  String,
        public correo:   String,
        public clave:    String,
        public rolid:    String,
        public estado:   String,
        public fechaCreado: Date
    ){ }
    
}