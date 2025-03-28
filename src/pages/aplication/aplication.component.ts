import { Component, signal, HostBinding, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSun, faMoon, faBars } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../Auth/service/auth.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { TranslateCustomService } from '../../shared/translate/translateCustom.service';
import { ItemBentoComponent } from './components/item-bento/item-bento.component';

@Component({
  selector: 'app-aplication',
  imports: [RouterLink, FontAwesomeModule, TranslateModule, ItemBentoComponent],
  templateUrl: './aplication.component.html',
  styleUrl: './aplication.component.css',
})

export class AplicationComponent {
  // Icons
  faSun = faSun;
  faMoon = faMoon;
  faBars = faBars;

  //services
  authService = inject(AuthService);
  translateCustomService = inject(TranslateCustomService);

  constructor(public translate: TranslateService) {
    this.translateCustomService.initLang(translate);
  }


  //section for darkMode
  private darkMode = signal<boolean>(false);
  protected readonly darkMode$ = computed(() => this.darkMode());

  //Variables
  wasMenuOpen = signal<boolean>(false);

  toggleMenu() {
    this.wasMenuOpen.set(!this.wasMenuOpen());
  }

  @HostBinding('class.dark') get mode() {
    return this.darkMode();
  }
  setDarkMode() {
    this.darkMode.set(!this.darkMode());
  }

  isLogged() {
    return localStorage.getItem('token') ? true : false;
  }

  signout() {
    this.authService.signOut();
  }
}
