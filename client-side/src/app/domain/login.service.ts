import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {catchError, flatMap} from 'rxjs/operators';
import { ApiResponse } from './model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<ApiResponse> {
    return this.http.post<any>("/api/login", {username: username, password: password})
      .pipe(
        flatMap(result => of(new ApiResponse(result.success, result.error)))
      )
  }

  isLogged(): Observable<boolean> {
    return this.http.get<any>('/api/logged').pipe(
      flatMap(result => of(result['loggedIn']))
    )
  }
}
