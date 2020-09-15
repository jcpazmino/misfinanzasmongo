import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';
import { Grupo } from '../models/grupo';
import { Global } from './global';

@Injectable()
export class GrupoService{
    public url: string;

    constructor(
        private _http: HttpClient,
    ){
        this.url = Global.url;
    }
    
    getGrupos(last: any = null): Observable<any>{
        var grupos = 'grupo/grupos';

        if(last!=null){
            grupos = 'grupo/grupos/true';
        }

        return this._http.get(this.url+grupos);
    }

    getGrupo(GrupoId): Observable<any>{
        return this._http.get(this.url+'grupo/grupo/'+GrupoId);
    }

    searchGrupo(searchString): Observable<any>{ 
        return this._http.get(this.url+'grupo/search/'+searchString); 
    }

    create(grupo): Observable<any>{
        let params = JSON.stringify(grupo);
        let headers = new HttpHeaders().set('Content-type', 'application/json');

        return this._http.post(this.url+'grupo/save', params, {headers: headers});
    }

    update(id, grupo): Observable<any>{
        let params = JSON.stringify(grupo);
        let headers = new HttpHeaders().set('Content-type', 'application/json');

        return this._http.put(this.url+'grupo/grupo/'+id, params, {headers: headers});
    }
    
    delete(id): Observable<any>{
        let headers = new HttpHeaders().set('Content-type', 'application/json');

        return this._http.delete(this.url+'grupo/grupo/'+id, {headers: headers});
    }
}