import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';
import { Movimiento } from '../models/movimiento';
import { Global } from './global';

@Injectable()
export class MovimientoService{
    public url: string;

    constructor( 
        private _http: HttpClient,
    ){
        this.url = Global.url;
    }
    
    getMovimientos(last: any = null): Observable<any>{
        var movimientos = 'movimiento/movimientos';

        if(last!=null){
            movimientos = 'movimiento/movimientos/true';
        }

        return this._http.get(this.url+movimientos);
    }

    getMovimiento(MovimientoId): Observable<any>{
        return this._http.get(this.url+'movimiento/movimiento/'+MovimientoId);
    }

    searchMovimiento(searchString): Observable<any>{
        return this._http.get(this.url+'movimiento/search/'+searchString); 
    }

    searchMovFechaConcepto(searchString): Observable<any>{
        return this._http.get(this.url+'movimiento/searchMovFechaConcepto/'+searchString);
    }

    searchMovFechaGrupo(searchString): Observable<any>{
        return this._http.get(this.url+'movimiento/searchMovFechaGrupo/'+searchString);
    }

    create(movimiento): Observable<any>{
        let params = JSON.stringify(movimiento);
        let headers = new HttpHeaders().set('Content-type', 'application/json');

        return this._http.post(this.url+'movimiento/save', params, {headers: headers});
    }

    update(id, movimiento): Observable<any>{
        let params = JSON.stringify(movimiento);
        let headers = new HttpHeaders().set('Content-type', 'application/json');

        return this._http.put(this.url+'movimiento/movimiento/'+id, params, {headers: headers});
    }
    
    delete(id): Observable<any>{
        let headers = new HttpHeaders().set('Content-type', 'application/json');

        return this._http.delete(this.url+'movimiento/movimiento/'+id, {headers: headers});
    }
}