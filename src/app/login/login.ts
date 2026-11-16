import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [ Validators.required,Validators.pattern(/^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|io)$/)]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?!.*\d)[A-Za-z]{10}$/)]],
    mayoriaedad: [false, [Validators.requiredTrue]]
  });

  isSubmitting = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe((value)=> console.log(value))
  }
  onSubmit() {
    if (this.loginForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const { email, password } = this.loginForm.value;

    if (this.authService.login(email, password)) {
      this.router.navigate(['/']);
    } else {
      this.errorMessage.set('Credenciales incorrectas');
      this.isSubmitting.set(false);
    }
  }
}
