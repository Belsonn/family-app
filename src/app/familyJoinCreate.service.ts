import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  createFamilyResponse,
  existsResponse,
  FamilyUserResponse,
  MeAndFamilyResponse,
} from './utils/family.models';

@Injectable({ providedIn: 'root' })
export class FamilyJoinCreateService {
  constructor(private http: HttpClient) {}

  type: string; // JOIN OR CREATE
  familyName: string;

  inviteCode: string;
  familyid: string;

  userName: string;
  password: string;
  gender: string;
  role: string;
  // isAuthenticated: boolean = false;

  checkCode(code) {
    return this.http.get<existsResponse>(
      `${environment.apiURL}family/code/${code}`
    );
  }

  createFamily() {
    return this.http.post<MeAndFamilyResponse>(
      `${environment.apiURL}family/nouser/create`,
      {
        username: this.userName,
        gender: this.gender,
        role: this.role,
        password: this.password,
        familyname: this.familyName,
      }
    );
  }

  joinFamily() {
    return this.http.post<MeAndFamilyResponse>(
      `${environment.apiURL}family/join`,
      {
        username: this.userName,
        gender: this.gender,
        role: this.role,
        password: this.password,
        familyid: this.familyid,
      }
    );
  }

  loginToFamily(familyUserId, password) {
    return this.http.post<MeAndFamilyResponse>(
      `${environment.apiURL}familyUser/login`,
      { familyUserId: familyUserId, password: password }
    );
  }
}
