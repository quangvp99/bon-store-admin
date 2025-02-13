import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  SERVER_URL= environment.BASE_API_URI.BASE_SERVICE_API;

  getListProduct(): Observable<any> {
    return this.http.get<any>(this.SERVER_URL+'/api/product');
  }

  getProduct(id:any): Observable<any> {
    return this.http.get<any>(this.SERVER_URL+'/api/product/' + id);
  }

  createProduct(data: any): Observable<any> {
    return this.http.post<any>(this.SERVER_URL+'/api/product/add', data);
  }

  updateProduct(id:any, data: any): Observable<any> {
    return this.http.put<any>(this.SERVER_URL+'/api/product/edit/' + id, data);
  }

  deleteProduct(id:any): Observable<any> {
    return this.http.delete<any>(this.SERVER_URL+'/api/product/' + id);
  }

  changeStatus(id:any): Observable<any> {
    return this.http.get<any>(this.SERVER_URL+'/api/product/status', {'params' : {'param' : id}});
  }
}
