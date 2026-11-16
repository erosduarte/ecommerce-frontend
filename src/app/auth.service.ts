import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = signal<boolean>(document.cookie.includes('auth=true_secure_session'));

  login(email: string, password: string): boolean {
    if (email && password) {
      this.isLoggedIn.set(true);
      document.cookie = `auth=true_secure_session;max-age=86400;path=/;secure;samesite=strict`;
      return true;
    }
    return false;
  }

  logout() {
    this.isLoggedIn.set(false);
    document.cookie = `auth=false;max-age=0;path=/`;
  }
}
