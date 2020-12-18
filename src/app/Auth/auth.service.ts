import { FamilyService } from './../family.service';
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

  savedRoute;
  savedParams;

  constructor(
    private http: HttpClient,
    private router: Router,
    private familyService: FamilyService
  ) {}

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
    if (response.token) {
      this.token = response.token;
      this.isAuthenticated = true;
      this.authStatus.next(true);
      this.saveAuthData(response.token, response.expiresIn);
      // this.userId = response.data.user._id;

      this.router.navigate(['', 'app', 'menu'])

    }
  }

  autoAuth() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      this.authStatus.next(false);
    }
    else {
      const now = new Date();
      const expires = authInfo.expirationDate.getTime() - now.getTime();
      if (expires > 0) {
        this.token = authInfo.token;
        this.familyService.getMeAndFamily().subscribe( res => {
          this.familyService.family = res.data.family
          this.familyService.familyUser = res.data.familyUser
          // this.familyService.familyUserId = res.data.familyUser._id
          this.isAuthenticated = true;
          this.authStatus.next(true);
        })
      }
    }
  }

  signup(email: String, password: String, passwordConfirm: String) {
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

  login(email: String, password: String) {
    const user = {
      email: email,
      password: password,
    };
    return this.http.post<AuthResponse>(
      `${environment.apiURL}users/login`,
      user
    );
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(['/']);
    this.authStatus.next(false);
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
    return {
      token: token,
      expirationDate: new Date(expirationDate),
    };
  }
}
