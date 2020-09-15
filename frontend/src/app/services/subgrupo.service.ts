import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';
import { Subgrupo } from '../models/subgrupo';
import { Global } from './global';

@Injectable()
export class SubgrupoService{
    public url: string;

    constructor(
        private _http: HttpClient,
    ){
        this.url = Global.url;
    }
    
    getSubgrupos(last: any = null): Observable<any>{
        var subgrupos = 'subgrupo/subgrupos';

        if(last!=null){
            subgrupos = 'subgrupo/subgrupos/true';
        }

        return this._http.get(this.url+subgrupos);
    }

    getSubgrupo(SubgrupoId): Observable<any>{
        return this._http.get(this.url+'subgrupo/subgrupo/'+SubgrupoId);
    }

    searchSubgrupo(searchString): Observable<any>{
        return this._http.get(this.url+'subgrupo/search/'+searchString);
    }

    create(subgrupo): Observable<any>{
        let params = JSON.stringify(subgrupo);
        let headers = new HttpHeaders().set('Content-type', 'application/json');

        return this._http.post(this.url+'subgrupo/save', params, {headers: headers});
    }

    update(id, subgrupo): Observable<any>{
        let params = JSON.stringify(subgrupo);
        let headers = new HttpHeaders().set('Content-type', 'application/json');

        return this._http.put(this.url+'subgrupo/subgrupo/'+id, params, {headers: headers});
    }
    
    delete(id): Observable<any>{
        let headers = new HttpHeaders().set('Content-type', 'application/json');

        return this._http.delete(this.url+'subgrupo/subgrupo/'+id, {headers: headers});
    }
}