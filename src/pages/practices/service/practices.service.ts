import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PracticeTest } from '../models/practices.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PracticesService {
  private END_POINT = 'http://localhost:3000/test';

  constructor(private http: HttpClient) {}

  getTest() {
    // Cambiamos la tipificación a any[] para el get inicial
    return this.http.get<any[]>(this.END_POINT).pipe(
      map((tests) => {
        return tests.map((test) => ({
          ...test,
          // Convertir el string de options a array
          options: JSON.parse(test.options.replace(/'/g, '"')),
        })) as PracticeTest[]; // Hacemos el casting al tipo correcto al final
      })
    );
  }
}
