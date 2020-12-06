import { FamilyResponse, MeAndFamilyResponse } from './utils/family.models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class FamilyService {
  familyId: string;
  familyUserId: string;

  constructor(private http: HttpClient, private router: Router) {}

  getFamily(familyid) {
    return this.http.get<FamilyResponse>(
      `${environment.apiURL}family/${familyid}`
    );
  }
  // api/family/familyuser
  getMeAndFamily(familyid, userid) {
    return this.http.get<MeAndFamilyResponse>(`${environment.apiURL}family/${familyid}/${userid}`)
  }
}
