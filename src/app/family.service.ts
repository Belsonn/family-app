import { Family, FamilyResponse, MeAndFamilyResponse, FamilyUser, FamilyUserResponse } from './utils/family.models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class FamilyService {
  familyId: string;
  familyUserId: string;
  family: Family;
  familyUser: FamilyUser;


  constructor(private http: HttpClient, private router: Router) {}

  getFamily(familyId) {
    return this.http.get<FamilyResponse>(
      `${environment.apiURL}family/family/${familyId}`
    );
  }
  getMeAndFamily() {
    return this.http.get<MeAndFamilyResponse>(`${environment.apiURL}family/myFamily`)
  }

  changePhoto(photo){
    return this.http.patch<MeAndFamilyResponse>(`${environment.apiURL}familyUser/addPhoto`, photo);
  }

  photoUpdate(family: Family){
    family.users.forEach(el => {
      el.photo = `${el.photo}?${Date.now()}`;
    })
  }

}