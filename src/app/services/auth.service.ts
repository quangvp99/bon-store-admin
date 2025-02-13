import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) { };

  SERVER_URL= environment.BASE_API_URI.BASE_SERVICE_API;

  public login(data: any): Observable<any> {
    return this.http.post<any>(this.SERVER_URL+'/api/auth/signin', data);
  }

  public signOut(): void {
    localStorage.removeItem('token');
  }
}
