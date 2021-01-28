import { RewardsService } from './../rewards.service';
import { Component, OnInit } from '@angular/core';
import { Reward } from 'src/app/utils/reward.models';

@Component({
  selector: 'app-rewards-main',
  templateUrl: './rewards-main.component.html',
  styleUrls: ['./rewards-main.component.scss'],
})
export class RewardsMainComponent implements OnInit {
  isLoading: boolean = false;

  basicRewards: Reward[];

  constructor(private rewardsService: RewardsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.getBasicRewards();
  }

  getBasicRewards() {
    this.rewardsService.getRewardsBasic().subscribe((res) => {
      this.basicRewards = res.data.rewards;
      console.log(this.basicRewards)
      this.isLoading = false;
    });
  }
}
