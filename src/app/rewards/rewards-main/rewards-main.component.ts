import { Router } from '@angular/router';
import { RewardsService } from './../rewards.service';
import { Component, OnInit } from '@angular/core';
import { Reward } from 'src/app/utils/reward.models';
import { FamilyService } from 'src/app/family.service';
import { FamilyUser } from 'src/app/utils/family.models';

@Component({
  selector: 'app-rewards-main',
  templateUrl: './rewards-main.component.html',
  styleUrls: ['./rewards-main.component.scss'],
})
export class RewardsMainComponent implements OnInit {
  isLoading: boolean = false;

  me: FamilyUser;

  basicRewards: Reward[];

  constructor(
    private rewardsService: RewardsService,
    private router: Router,
    private familyService: FamilyService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.me = this.getMe();
    this.getBasicRewards();
  }

  getMe(): FamilyUser {
    return this.familyService.familyUser;
  }

  getBasicRewards() {
    this.rewardsService.getRewardsBasic().subscribe((res) => {
      this.basicRewards = res.data.rewards;
      // console.log(this.basicRewards)
      this.isLoading = false;
    });
  }

  editReward(reward: Reward) {
    this.router.navigate(['', 'app', 'rewards', 'add'], {
      queryParams: { id: reward._id },
    });
  }
}
