import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RearrangeSentences } from '../models/sentences.model';

@Injectable({
  providedIn: 'root',
})
export class RearrangeSentencesService {
  private END_POINT = 'http://localhost:3000/rearrange';

  constructor(private http: HttpClient) {}

  getTest(): Observable<RearrangeSentences[]> {
    return this.http.get<any[]>(this.END_POINT);
  }
}
