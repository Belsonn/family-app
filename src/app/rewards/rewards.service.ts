import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RewardsResponse } from '../utils/reward.models';

@Injectable({
  providedIn: 'root',
})
export class RewardsService {
  constructor(private http: HttpClient) {}

  getRewardsBasic() {
    return this.http.get<RewardsResponse>(`${environment.apiURL}rewards/basic`);
  }
  getRewardsUnlocked() {
    return this.http.get<RewardsResponse>(`${environment.apiURL}rewards/unlocked`);
  }
}
