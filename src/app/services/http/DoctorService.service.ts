import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  constructor(private http: HttpClient) {}


  async index(page = 1, search = null) {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('search', search ? search : '');
    return await this.http.get(environment.endpoint + `/user/index_doctors`,{
      params: params
    }).toPromise();
  }

  async update(id : number ,data : any) {
    return await this.http.put(environment.endpoint + `/users/`  + id, data).toPromise();
  }
  
  async delete(id : number) {
    return await this.http.delete(environment.endpoint + `/users/`  + id).toPromise();
  }

  async store(data : any) {
    return await this.http.post(environment.endpoint + `/users`,data).toPromise();
  }
  
}
