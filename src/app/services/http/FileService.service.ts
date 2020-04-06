import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { ILogin } from '../../interfaces/user/login';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private http: HttpClient) {}

  async upload_file(file : any, path = "default") {
  /*   const httpOptions = {
      headers: new HttpHeaders({
       "Content-Type": "multipart/form-data",
       "Accept": "application/json"// 👈
      })
    }; */
    let formData = new FormData();
    formData.append("file", file);
    formData.append("path", path); 
    /* var imagefile = document.querySelector('#file');
    axios.post('upload_file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    }) */
    console.log(formData);
    return await this.http.post(environment.endpoint + `/upload_file`,
      formData/* ,httpOptions */).toPromise();
  }

}
