import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable, shareReplay } from 'rxjs';
import { makeStateKey, TransferState } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
export const TRANSLATE_KEY = makeStateKey<object>('translate');
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@Injectable({
  providedIn: 'root',
})
export class TranslateCustomService {
  private readonly document = inject(DOCUMENT);
  private readonly transferState = inject(TransferState);
  defaultLanguage = 'es';

  constructor(public translate: TranslateService) {}

  useLanguage(language: string): void {
    this.translate.use(language);
    this.document.documentElement.lang = language;
  }
  getTranslation(key: string): Observable<string> {
    return this.translate
      .get(key)
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }
}
