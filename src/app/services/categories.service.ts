import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { };

  SERVER_URL= environment.BASE_API_URI.BASE_SERVICE_API;

  getListCategory(): Observable<any> {
    return this.http.get<any>(this.SERVER_URL+'/api/category');
  }

  getCategory(id:any): Observable<any> {
    return this.http.get<any>(this.SERVER_URL+'/api/category/' + id);
  }

  createCategory(data: any): Observable<any> {
    return this.http.post<any>(this.SERVER_URL+'/api/category/add', data);
  }

  updateCategory(id:any, data: any): Observable<any> {
    return this.http.put<any>(this.SERVER_URL+'/api/category/edit/' + id, data);
  }

  deleteCategory(id:any): Observable<any> {
    return this.http.delete<any>(this.SERVER_URL+'/api/category/' + id);
  }

  changeStatus(id:any): Observable<any> {
    return this.http.get<any>(this.SERVER_URL+'/api/category/status', {'params' : {'param' : id}});
  }
}
