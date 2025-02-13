import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  SERVER_URL= environment.BASE_API_URI.BASE_SERVICE_API;

  uploadFile(data:any): Observable<any> {
    return this.http.post<any>(this.SERVER_URL+'/api/file/upload', data);
  }

  uploadFileList(data:any): Observable<any> {
    return this.http.post<any>(this.SERVER_URL+'/api/file/uploadlist', data);
  }

}
