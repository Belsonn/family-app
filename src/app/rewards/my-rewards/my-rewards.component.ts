import { RewardsService } from './../rewards.service';
import { Reward } from 'src/app/utils/reward.models';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-rewards',
  templateUrl: './my-rewards.component.html',
  styleUrls: ['./my-rewards.component.scss'],
})
export class MyRewardsComponent implements OnInit {
  isLoading: boolean;

  rewards: Reward[];

  constructor(private rewardsService: RewardsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.getMyRewards();
  }

  getMyRewards() {
    this.rewardsService.getMyRewards().subscribe((res) => {
      this.rewards = res.data.rewards;
      console.log(this.rewards);
      this.isLoading = false;
    });
  }
}
