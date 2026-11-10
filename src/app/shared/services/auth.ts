import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

interface User {
  id?: string,
  name: string,
  email: string,
  password: string,
  phone: number
}

interface LoginUser {
  id?: string,
  email: string,
  password: string,
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  getUser(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

  login(user: LoginUser): Observable<User | null> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      map(users => users.find(
        u => u.email === user.email && u.password === user.password
      ) ?? null)
    );
  }

  resetPassword(userID:string, password: string): Observable<User | null> {
    return this.http.patch<User>(`${this.apiUrl}/users/${userID}`, {
      password: password
    });
  }
}
