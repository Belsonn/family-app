import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { createFamilyResponse, existsResponse } from './utils/familyJoinCreateResponses.model';



@Injectable({ providedIn: 'root' })
export class FamilyJoinCreateService {
  constructor(private http: HttpClient) {}

  type: string; // JOIN OR CREATE
  familyName: string;
  inviteCode: string;
  userName: string;
  password: string;
  gender: string;
  role: string;
  isAuthenticated: boolean = false;

  checkCode() {
    return this.http.get<existsResponse>(
      `${environment.apiURL}family/code/${this.inviteCode}`
    );
  }

  createFamily() {
    return this.http.post<createFamilyResponse>(
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
}
