import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { ILogin } from '../../interfaces/user/login';

@Injectable({
  providedIn: 'root',
})
export class ClubImageService {
  constructor(private http: HttpClient) {}

  async show(id: number) {
    return await this.http.get(environment.endpoint + `/site_images/` + id).toPromise();
  }

  async update(id: number,data: any) {
    return await this.http.put(environment.endpoint + `/site_images/` + id, data).toPromise();
  }

  async store(data : any) {
    return await this.http.post(environment.endpoint + `/site_images`,data).toPromise();
  }

  
}
