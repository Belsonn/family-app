import { FamilyUser } from './family.models';
export interface Reward {
  _id?: string;
  name: string;
  points: number;
  unlockedBy?: FamilyUser | string;
  unlockedAt?: Date;
}

export interface RewardResponse {
  status: string;
  data: {
    reward: Reward;
  };
}

export interface RewardsResponse {
  status: string;
  data: {
    rewards: Reward[];
  };
}
