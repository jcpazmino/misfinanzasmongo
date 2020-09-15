import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';
import { Fijo } from '../models/fijo';
import { Global } from './global';

@Injectable()
export class FijoService{
    public url: string;

    constructor(
        private _http: HttpClient,
    ){
        this.url = Global.url;
    }
    
    getFijos(last: any = null): Observable<any>{
        var fijos = 'fijo/fijos';

        if(last!=null){
            fijos = 'fijo/fijos/true';
        }

        return this._http.get(this.url+fijos);
    }

    getFijo(FijoId): Observable<any>{
        return this._http.get(this.url+'fijo/fijo/'+FijoId);
    }

    searchFijo(searchString): Observable<any>{
        return this._http.get(this.url+'fijo/search/'+searchString);
    }

    create(fijo): Observable<any>{
        let params = JSON.stringify(fijo); 
        let headers = new HttpHeaders().set('Content-type', 'application/json');

        return this._http.post(this.url+'fijo/save', params, {headers: headers});
    }

    update(id, fijo): Observable<any>{
        let params = JSON.stringify(fijo);
        let headers = new HttpHeaders().set('Content-type', 'application/json');

        return this._http.put(this.url+'fijo/fijo/'+id, params, {headers: headers});
    }
    
    delete(id): Observable<any>{
        let headers = new HttpHeaders().set('Content-type', 'application/json');

        return this._http.delete(this.url+'fijo/fijo/'+id, {headers: headers});
    }
}