import { RewardsService } from './../rewards.service';
import { Component, OnInit } from '@angular/core';
import { Reward } from 'src/app/utils/reward.models';

@Component({
  selector: 'app-rewards-unlocked',
  templateUrl: './rewards-unlocked.component.html',
  styleUrls: ['./rewards-unlocked.component.scss'],
})
export class RewardsUnlockedComponent implements OnInit {
  isLoading = false;

  rewardsUnlocked: Reward[];

  constructor(private rewardsService: RewardsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.getRewards();
  }

  getRewards() {
    this.rewardsService.getRewardsUnlocked().subscribe((res) => {
      this.rewardsUnlocked = res.data.rewards;
      console.log(this.rewardsUnlocked);
      this.isLoading = false;
    });
  }
}
