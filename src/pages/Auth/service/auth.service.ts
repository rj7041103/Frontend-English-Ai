import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { StateService } from '../../../storage/state.service';

interface Login {
  email: string;
  password: string;
}

interface Register extends Login {
  name: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrlRegister = environment.apiRegister; // Reemplaza con la URL de tu backend
  private apiUrlLogin = environment.apiLogin;
  token = signal('');
  stateService = inject(StateService);
  constructor(private http: HttpClient) {}

  postDataRegister(data: Register): Observable<Register> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const registerSuccess = this.http.post<any>(this.apiUrlRegister, data, {
      headers,
    });
    registerSuccess.subscribe((res) => {
      this.token.set(res.token);
      this.stateService.setAccessToken(res.token);
    });
    return registerSuccess;
  }

  postDataLogin(data: Login): Observable<Login> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const loginSuccess = this.http.post<any>(this.apiUrlLogin, data, {
      headers,
    });
    loginSuccess.subscribe((res) => {
      this.token.update((value) => (value = res.token));
      this.stateService.setAccessToken(res.token);
    });
    return loginSuccess;
  }
}
