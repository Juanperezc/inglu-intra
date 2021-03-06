import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClubImageItemService {
  constructor(private http: HttpClient) {}


  async delete(id : number) {
    return await this.http.delete(environment.endpoint + `/site_image_items/`  + id).toPromise();
  }

  async store(data : any) {
    return await this.http.post(environment.endpoint + `/site_image_items`,data).toPromise();
  }
  
}
