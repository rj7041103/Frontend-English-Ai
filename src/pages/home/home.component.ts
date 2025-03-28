import {
  Component,
  computed,
  ElementRef,
  HostBinding,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faSun,
  faMoon,
  faBars,
  faVideo,
  faUsers,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import { SelectTranslationComponent } from '../../shared/components/select-translation/select-translation.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import {
  faFacebookF,
  faInstagram,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { AuthService } from '../Auth/service/auth.service';
import { TranslateCustomService } from '../../shared/translate/translateCustom.service';
@Component({
  selector: 'app-home',
  imports: [
    FontAwesomeModule,
    SelectTranslationComponent,
    TranslateModule,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  // Icons
  faSun = faSun;
  faMoon = faMoon;
  faBars = faBars;
  faFacebookF = faFacebookF;
  faInstagram = faInstagram;
  faTwitter = faTwitter;
  faUsers = faUsers;
  faVideo = faVideo;
  faChartLine = faChartLine;

  //section for darkMode
  private darkMode = signal<boolean>(false);
  protected readonly darkMode$ = computed(() => this.darkMode());

  //Assets for the page
  flag_url: string = '../../assets/images/FlagEs.png';

  //services
  authService = inject(AuthService);
  translateCustomService = inject(TranslateCustomService);

  //HMTL Elements
  container_carousel =
    viewChild<ElementRef<HTMLDivElement>>('carouselContainer');

  //Variables
  wasMenuOpen = signal<boolean>(false);

  constructor(public translate: TranslateService) {
    this.translateCustomService.initLang(translate);
  }

  ngAfterViewInit() {
    this.initializeCarousel();
  }
  @HostBinding('class.dark') get mode() {
    return this.darkMode();
  }
  setDarkMode() {
    this.darkMode.set(!this.darkMode());
  }

  changeFlag(event: string) {
    const lang = event;
    lang === 'en'
      ? (this.flag_url = `../../assets/images/FlagEn.png`)
      : (this.flag_url = `../../assets/images/FlagEs.png`);
  }

  isLogged() {
    return localStorage.getItem('token') ? true : false;
  }

  signout() {
    this.authService.signOut();
  }

  toggleMenu() {
    this.wasMenuOpen.set(!this.wasMenuOpen());
  }

  private initializeCarousel() {
    const slides = this.container_carousel()?.nativeElement.children;
    if (!slides || slides.length === 0) return;

    let current = 0;

    // Activar primera slide
    slides[current].classList.add('active');

    const nextSlide = () => {
      slides[current].classList.remove('active');
      slides[current].classList.add('prev');

      current = (current + 1) % slides.length;

      slides[current].classList.add('active');
      setTimeout(() => slides[current].classList.remove('prev'), 10);
    };

    setInterval(nextSlide, 4000);
  }
}
