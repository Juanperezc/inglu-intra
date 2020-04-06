import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClaimService {
  constructor(private http: HttpClient) {}


  async update(id : number ,data : any) {
    return await this.http.put(environment.endpoint + `/claims/`  + id, data).toPromise();
  }
  async delete(id : number) {
    return await this.http.delete(environment.endpoint + `/claims/`  + id).toPromise();
  }

  async store(data : any) {
    return await this.http.post(environment.endpoint + `/claims`,data).toPromise();
  }
  
}
