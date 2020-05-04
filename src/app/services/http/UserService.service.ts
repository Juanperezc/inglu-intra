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


  async index_patient() {
    return await this.http.get(environment.endpoint + `/user/index_patient`).toPromise();
  }

  //user/workspace/{user}
  async show_workspace(id) {
    return await this.http.get(environment.endpoint + `/user/workspace/` + id).toPromise();
  }

  async index_doctors() {
    return await this.http.get(environment.endpoint + `/user/index_doctors`).toPromise();
  }

  async login(data: ILogin) {
      return await this.http.post(environment.endpoint + `/login`, data).toPromise();
  }

  async logout() {
    return await this.http.delete(environment.endpoint + `/logout`).toPromise();
  }

  async show(id: number) {
    return await this.http.get(environment.endpoint + `/users/` + id).toPromise();
  }
  async show_medical_record(id: number) {
    return await this.http.get(environment.endpoint + `/user/medical_record/` + id).toPromise();
  }

  async update(id: number,data: any) {
    return await this.http.put(environment.endpoint + `/users/` + id, data).toPromise();
  }

  async update_medical_record(id: number,data: any) {
    return await this.http.put(environment.endpoint + `/user/medical_record/` + id, data).toPromise();
  }
  async change_password(data: any,id: number) {
    return await this.http.post(environment.endpoint + `/user/change_password/` + id, data).toPromise();
  }

  async store(data : any) {
    return await this.http.post(environment.endpoint + `/users`,data).toPromise();
  }

  async me() {
    return await this.http.get(environment.endpoint + `/user/me`).toPromise();
  }

  async store_specialty(data : any,id) {
    return await this.http.post(environment.endpoint + `/user/specialty/${id}`,data).toPromise();
  }

  async store_workspace(data : any,id) {
    return await this.http.post(environment.endpoint + `/user/workspace/${id}`,data).toPromise();
  }

  async delete_specialty(data : any,id) {
    return await this.http.post(environment.endpoint + `/user/specialty_delete/${id}`, data).toPromise();
  }
  async delete_workspace(data : any,id) {
    return await this.http.post(environment.endpoint + `/user/workspace_delete/${id}`, data).toPromise();
  }
  
}
