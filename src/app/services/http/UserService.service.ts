import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { ILogin } from '../../interfaces/user/login';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  async login(data: ILogin) {
      return await this.http.post(environment.endpoint + `/login`, data).toPromise();
  }

  async logout() {
    return await this.http.delete(environment.endpoint + `/logout`).toPromise();
  }

  async show(id: number) {
    return await this.http.get(environment.endpoint + `/users/` + id).toPromise();
  }

  async update(id: number,data: any) {
    return await this.http.put(environment.endpoint + `/users/` + id, data).toPromise();
  }

  async change_password(data: any) {
    return await this.http.post(environment.endpoint + `/user/change_password`, data).toPromise();
  }

  async me() {
    return await this.http.get(environment.endpoint + `/user/me`).toPromise();
  }
  
}
