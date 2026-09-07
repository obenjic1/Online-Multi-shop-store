import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private readonly API_URL = 'http://localhost:8080/api/auth';

  private readonly TOKEN_KEY = 'access_token';
  private readonly USERNAME_KEY = 'username';
  private readonly ROLE_KEY = 'role';

  login(request: LoginRequest): Observable<LoginResponse> {

    return this.http
      .post<LoginResponse>(
        `${this.API_URL}/login`,
        request
      )
      .pipe(
        tap(response => {

          localStorage.setItem(
            this.TOKEN_KEY,
            response.token
          );

          localStorage.setItem(
            this.USERNAME_KEY,
            response.username
          );

          localStorage.setItem(
            this.ROLE_KEY,
            response.role
          );
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
  }

  getRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRole() === 'ROLE_ADMIN';
  }

  isSuperAdmin(): boolean {
    return this.getRole() === 'ROLE_SUPER_ADMIN';
  }

  logout(): void {

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
    localStorage.removeItem(this.ROLE_KEY);
  }
}
