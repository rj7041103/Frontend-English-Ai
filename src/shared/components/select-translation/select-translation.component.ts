import { Component, output } from '@angular/core';
import { TranslateCustomService } from '../../translate/translateCustom.service';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-select-translation',
  imports: [FormsModule],
  templateUrl: './select-translation.component.html',
  styleUrl: './select-translation.component.css',
})
export class SelectTranslationComponent {
  selectedLanguage = 'es';
  private readonly destroy$ = new Subject<void>();
  changeFlagEvent = output<string>();
  //Languages array
  languages = [
    {
      image_url: '../../../assets/images/FlagEn.png',
      code: 'en',
    },
    {
      image_url:
        'https://app.talkpal.ai/_next/image?url=https%3A%2F….s3.amazonaws.com%2Fflags%2Fspanish.png&w=32&q=75',
      code: 'es',
    },
  ];
  constructor(public translateService: TranslateCustomService) {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  changeLanguage(language: string): void {
    this.translateService.useLanguage(language);
  }
  updateLanguage() {
    this.changeFlagEvent.emit(this.selectedLanguage);
    this.changeLanguage(this.selectedLanguage);
  }
}
