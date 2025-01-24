import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, FontAwesomeModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  form: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);
  //accesories
  faArrowLeft = faArrowLeft;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8), Validators.required]],
    });
  }

  onSubmit() {
    this.authService.postDataRegister(this.form.value);
    this.router.navigateByUrl('/app');
  }
}
