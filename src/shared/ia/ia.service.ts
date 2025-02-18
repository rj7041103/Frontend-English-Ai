import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class IaService {
  async initModel(): Promise<string> {
    const tokenResponse = await fetch('http://localhost:3000/session');
    const data = await tokenResponse.json();
    const EPHEMERAL_KEY = data.client_secret.value;
    console.log('Ephemeral: ', EPHEMERAL_KEY);
    return EPHEMERAL_KEY;
  }
}
