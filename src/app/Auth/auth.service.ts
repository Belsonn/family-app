import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { createFamilyResponse } from '../utils/familyJoinCreateResponses.model';
import { AuthResponse } from './../utils/authResponse.model';
import { UserModelResponse } from './../utils/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private isLocalAuthenticated = false;
  private token: string;
  private userId: string;
  private familyUserId: string;
  private familyToken: string;
  private emailValidator = Validators.pattern(
    '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
  );

  private authStatus = new Subject<boolean>();
  private authLocalStatus = new Subject<boolean>();

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
  getFamilyUserId() {
    return this.familyUserId;
  }
  getFamilyToken() {
    return this.familyToken;
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
      // this.userName = response.data.user.name;
      this.userId = response.data.user._id;
      this.isAuthenticated = true;
      this.authStatus.next(true);
      this.saveAuthData(response.token, response.expiresIn);
      // this.router.navigate(['/home']);
    }
  }

  onLocalAuth(response: createFamilyResponse){
    if(response.data){
      this.familyToken = response.data.inviteToken
      this.userId = response.data.users[0];
      this.isLocalAuthenticated = true
      this.authLocalStatus.next(true);
      this.saveLocalData(this.userId, this.familyToken);
    }
  }

  autoAuth() {
    const authInfo = this.getAuthData();
    const localInfo = this.getLocalData();
    if (!authInfo || !localInfo) {
      return;
    }
    if (authInfo) {
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
    } else if (localInfo) {
      this.familyToken = localInfo.familyToken;
      this.familyUserId = localInfo.familyUserId;
      this.isLocalAuthenticated = true;
      this.authLocalStatus.next(true);
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
    this.authStatus.next(false);
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  getMe() {
    return this.http.get<UserModelResponse>(`${environment.apiURL}users/me`);
  }

  private saveAuthData(token: string, expirationDate: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate);
  }
  private saveLocalData(familyUserId: string, familyToken: string) {
    localStorage.setItem('familyUserId', familyUserId);
    localStorage.setItem('familyToken', familyToken);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('familyUserId');
    localStorage.removeItem('familyToken');
  }

  private getLocalData() {
    const familyUserId = localStorage.getItem('familyUserId');
    const familyToken = localStorage.getItem('familyToken');
    if (!familyUserId || !familyToken) {
      return;
    }
    return {
      familyUserId: familyUserId,
      familyToken: familyToken,
    };
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
