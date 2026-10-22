import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUserRequest, UpdateUserRequest, User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Service()
export class UserService {


  private http = inject(HttpClient);

  private readonly API_URL = environment.apiUrl +
    '/users';


  // =========================================================
  // GET ALL USERS
  // =========================================================

  getUsers(): Observable<User[]> {

    return this.http.get<User[]>(
      this.API_URL
    );

  }


  // =========================================================
  // GET USER
  // =========================================================

  getUser(id: number): Observable<User> {

    return this.http.get<User>(
      `${this.API_URL}/${id}`
    );

  }


  // =========================================================
  // CREATE USER
  // =========================================================

  createUser(
    request: CreateUserRequest
  ): Observable<User> {

    return this.http.post<User>(
      this.API_URL,
      request
    );

  }


  // =========================================================
  // UPDATE USER
  // =========================================================

  updateUser(
    id: number,
    request: UpdateUserRequest
  ): Observable<User> {

    return this.http.put<User>(
      `${this.API_URL}/${id}`,
      request
    );

  }


  // =========================================================
  // UPDATE STATUS
  // =========================================================

  updateStatus(
    id: number,
    enabled: boolean
  ): Observable<User> {

    return this.http.patch<User>(
      `${this.API_URL}/${id}/status`,
      null,
      {
        params: {
          enabled: enabled
        }
      }
    );

  }


  // =========================================================
  // DELETE USER
  // =========================================================

  deleteUser(id: number): Observable<void> {

    return this.http.delete<void>(
      `${this.API_URL}/${id}`
    );

  }

  getAvailableAdmins(): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.API_URL}/available-admins`
    );
  }
}
