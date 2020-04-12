import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  constructor(private http: HttpClient) {}


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
