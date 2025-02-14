import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AppStore } from '../../../store/store';
import { Login, Register } from '../models/auth.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //urls
  private apiUrlRegister = environment.apiRegister; // Reemplaza con la URL de tu backend
  private apiUrlLogin = environment.apiLogin;
  //store
  readonly store = inject(AppStore);
  constructor(private http: HttpClient) {}

  postDataRegister(data: Register) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const registerSuccess = this.http.post<any>(this.apiUrlRegister, data, {
      headers,
    });
    registerSuccess.subscribe((res) => {
      localStorage.setItem('token', res.access_token);
    });
  }

  postDataLogin(data: Login) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const loginSuccess = this.http.post<any>(this.apiUrlLogin, data, {
      headers,
    });
    loginSuccess.subscribe((res) => {
      localStorage.setItem('token', res.access_token);
    });
  }

  signOut() {
    localStorage.removeItem('token');
  }
}
