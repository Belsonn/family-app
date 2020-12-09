import { FamilyJoinCreateService } from './../familyJoinCreate.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  createFamilyResponse,
  MeAndFamilyResponse,
} from '../utils/family.models';
import { AuthResponse } from './../utils/authResponse.model';
import { UserModelResponse } from './../utils/user.model';
import { FamilyService } from '../family.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private isLocalAuthenticated = false;
  private authType: string;
  private token: string;
  private userId: string;
  private familyUserId: string;
  private familyToken: string;
  private familyId: string;
  private emailValidator = Validators.pattern(
    '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
  );

  private authStatus = new Subject<boolean>();
  // private authLocalStatus = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private familyService: FamilyService,
    private familyJoinCreateService: FamilyJoinCreateService,
    private router: Router
  ) {}

  getToken() {
    return this.token;
  }
  getIsAuthenticated() {
    return this.isAuthenticated;
  }
  getIsLocalAuthenticated() {
    return this.isLocalAuthenticated;
  }
  getAuthType() {
    return this.authType;
  }
  getUserId() {
    return this.userId;
  }
  getFamilyUserId() {
    return this.familyUserId;
  }
  getFamilyToken() {
    return this.familyToken;
  }
  getAuthStatus() {
    return this.authStatus.asObservable();
  }
  // getAuthLocalStatus() {
  //   return this.authLocalStatus.asObservable();
  // }
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
      return;
    }
    else {
      const now = new Date();
      const expires = authInfo.expirationDate.getTime() - now.getTime();
      if (expires > 0) {
        this.token = authInfo.token;
        this.isAuthenticated = true;
        this.authStatus.next(true);
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
    this.authStatus.next(false);
    this.router.navigate(['/']);
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
