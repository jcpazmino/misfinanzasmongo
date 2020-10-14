import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';
import { Usuario } from '../models/usuario';
import { Global } from './global';

@Injectable()
export class UsuarioService{
    public url: string;

    constructor(
        private _http: HttpClient,
    ){
        this.url = Global.url;
    }
    
    getUsuarioId(usuarioId): Observable<any>{
        return this._http.get(this.url+'usuario/usuarioId/'+usuarioId);
    }

    actualizarclave(usuarioId, clave:string): Observable<any>{
        const body = { clave: clave };
        return this._http.put(this.url+'usuario/actualizarClave/'+usuarioId, body);
    }

    actualizar(usuarioId, usuario): Observable<any>{
        let params = JSON.stringify(usuario);
        let headers = new HttpHeaders().set('Content-type', 'application/json');

        return this._http.put(this.url+'usuario/actualizar/'+usuarioId, params, {headers: headers});
    }

    subirfoto(usuarioId, formData): Observable<any>{
        return this._http.post(this.url+'usuario/upload-image/'+usuarioId, formData);
    }
}