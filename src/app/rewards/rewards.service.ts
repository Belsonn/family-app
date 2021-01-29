import { Reward } from './../utils/reward.models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RewardResponse, RewardsResponse } from '../utils/reward.models';

@Injectable({
  providedIn: 'root',
})
export class RewardsService {
  constructor(private http: HttpClient) {}

  getRewardsBasic() {
    return this.http.get<RewardsResponse>(`${environment.apiURL}rewards/basic`);
  }
  getRewardsUnlocked() {
    return this.http.get<RewardsResponse>(
      `${environment.apiURL}rewards/unlocked`
    );
  }

  getSingleReward(id: string) {
    return this.http.get<RewardResponse>(
      `${environment.apiURL}rewards/reward/${id}`
    );
  }
  updateReward(id: string, reward: Reward) {
    return this.http.patch<RewardResponse>(
      `${environment.apiURL}rewards/reward/${id}`,
      reward
    );
  }

  addNewReward(reward: Reward) {
    return this.http.post<RewardResponse>(
      `${environment.apiURL}rewards/createReward`,
      reward
    );
  }
  unlockReward(reward: Reward) {
    return this.http.post<RewardResponse>(
      `${environment.apiURL}rewards/unlock`,
      reward
    );
  }
}
