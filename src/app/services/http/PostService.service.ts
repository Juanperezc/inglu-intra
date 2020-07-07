import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}


  async all_categories() {
    return await this.http.get(environment.endpoint + `/post_category`).toPromise();
  }

  async update(id : number ,data : any) {
    return await this.http.put(environment.endpoint + `/posts/`  + id, data).toPromise();
  }
  async delete(id : number) {
    return await this.http.delete(environment.endpoint + `/posts/`  + id).toPromise();
  }

  async store(data : any) {
    return await this.http.post(environment.endpoint + `/posts`,data).toPromise();
  }
  
}
