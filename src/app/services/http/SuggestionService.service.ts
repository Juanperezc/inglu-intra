import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SuggestionService {
  constructor(private http: HttpClient) {}

  async update(id : number ,data : any) {
    return await this.http.put(environment.endpoint + `/suggestions/`  + id, data).toPromise();
  }
  async delete(id : number) {
    return await this.http.delete(environment.endpoint + `/suggestions/`  + id).toPromise();
  }
  async store(data : any) {
    return await this.http.post(environment.endpoint + `/suggestions`,data).toPromise();
  }
}
