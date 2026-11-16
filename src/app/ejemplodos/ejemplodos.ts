import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { inject, signal } from '@angular/core';
@Component({
  imports: [],
  selector: 'app-ejemplodos',
  styleUrl: './ejemplodos.css',
  templateUrl: './ejemplodos.html',
})
export class Ejemplodos {
  service = inject(AuthService);
  esLogeado = signal<boolean>(this.service.isLoggedIn());
  

}
