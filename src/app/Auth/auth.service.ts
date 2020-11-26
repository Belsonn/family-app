import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse } from './../utils/authResponse.model';
import { UserModelResponse } from './../utils/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private userId: string;
  private emailValidator = Validators.pattern(
    '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
  );

  private authStatus = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }
  getIsAuthenticated() {
    return this.isAuthenticated;
  }
  getUserId() {
    return this.userId;
  }
  getAuthStatus() {
    return this.authStatus.asObservable();
  }
  getEmailValidator() {
    return this.emailValidator;
  }

  onAuth(response: AuthResponse) {
    this.token = response.token;
    if (response.token) {
      // this.userName = response.data.user.name;
      this.userId = response.data.user._id;
      this.isAuthenticated = true;
      this.authStatus.next(true);
      this.saveAuthData(response.token, response.expiresIn);
      // this.router.navigate(['/home']);
    }
  }

  autoAuth() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expires = authInfo.expirationDate.getTime() - now.getTime();
    if (expires > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.authStatus.next(true);
      this.getMe().subscribe((res) => {
        this.userId = res.data.user._id;
      });
    }
  }

  signup(email: string, password: string, passwordConfirm: string) {
    const newUser = {
      email: email,
      password: password,
      passwordConfirm: passwordConfirm,
    };
    return this.http.post<AuthResponse>(
      `${environment.apiURL}users/signup`,
      newUser
    );
  }

  login(email: string, password: string){
    const user = {
      email: email,
      password: password
    }
    return this.http.post<AuthResponse>(`${environment.apiURL}users/login`, user)
  }

  getMe() {
    return this.http.get<UserModelResponse>(`${environment.apiURL}users/me`);
  }


  private saveAuthData(token: string, expirationDate: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    if (!token || !expirationDate) {
      return;
    }
    // console.log(token, expirationDate);
    return {
      token: token,
      expirationDate: new Date(expirationDate),
    };
  }
}
