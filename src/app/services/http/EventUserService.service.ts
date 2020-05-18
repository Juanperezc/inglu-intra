import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventUserService {
  constructor(private http: HttpClient) {}

  async index() {

    let params = new HttpParams();
    params = params.append('per_page', '100000');

    return await this.http.get(environment.endpoint + `/event/user`,{
      params: params
    }).toPromise();
  }

  async update(id : number ,data : any) {
    return await this.http.put(environment.endpoint + `/event/user/`  + id, data).toPromise();
  }

  async delete(id : number) {
    return await this.http.delete(environment.endpoint + `/event/user/`  + id).toPromise();
  }

  async store(data : any) {
    return await this.http.post(environment.endpoint + `/event/user`,data).toPromise();
  }
  
}
