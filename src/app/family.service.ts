import { IconResponse } from './utils/files.models';
import {
  Family,
  FamilyResponse,
  MeAndFamilyResponse,
  FamilyUser,
  FamilyUserResponse,
} from './utils/family.models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { SmoothScrollToOptions } from 'ngx-scrollbar/smooth-scroll';

@Injectable({ providedIn: 'root' })
export class FamilyService {
  familyId: string;
  familyUserId: string;
  family: Family;
  familyUser: FamilyUser;

  scrollSub = new Subject<SmoothScrollToOptions>();
  scrollbarSub = new Subject<boolean>();

  containerHeight: number;

  constructor(private http: HttpClient, private router: Router) {}

  getFamily(familyId) {
    return this.http.get<FamilyResponse>(
      `${environment.apiURL}family/family/${familyId}`
    );
  }
  // getMyFamily() {
  //   return this.http.get<FamilyResponse>()
  // }
  getMeAndFamily() {
    return this.http.get<MeAndFamilyResponse>(
      `${environment.apiURL}family/myFamily`
    );
  }

  getMe(){
    return this.http.get<FamilyUserResponse>(`${environment.apiURL}familyUser/me`)
  }

  getMyFamily(){
    return this.http.get<FamilyResponse>(`${environment.apiURL}family/me`)
  }
  updateMe(updateInfo) {
    return this.http.patch<FamilyUserResponse>(
      `${environment.apiURL}familyUser/updateMe`,
      updateInfo
    );
  }

  changePhoto(photo) {
    return this.http.patch<MeAndFamilyResponse>(
      `${environment.apiURL}familyUser/addPhoto`,
      photo
    );
  }

  photoUpdate(family: Family) {
    family.users.forEach((el) => {
      el.photo = `${el.photo}?${Date.now()}`;
    });
  }

  getIcons() {
    return this.http.get<IconResponse>(`${environment.apiURL}files/icons`);
  }
}
