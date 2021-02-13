import { Settings } from './../../utils/settings.models';
import { SettingsService } from './../../settings/settings.service';
import { UnlockRewardComponent } from '../dialogs/unlock-reward/unlock-reward.component';
import { Router } from '@angular/router';
import { RewardsService } from './../rewards.service';
import { Component, OnInit } from '@angular/core';
import { Reward } from 'src/app/utils/reward.models';
import { FamilyService } from 'src/app/family.service';
import { FamilyUser } from 'src/app/utils/family.models';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-rewards-main',
  templateUrl: './rewards-main.component.html',
  styleUrls: ['./rewards-main.component.scss'],
})
export class RewardsMainComponent implements OnInit {
  isLoading: boolean = false;

  me: FamilyUser;

  unlockedInfo: boolean = false;

  isParent: boolean;
  settings: Settings

  basicRewards: Reward[];

  constructor(
    private rewardsService: RewardsService,
    private router: Router,
    private familyService: FamilyService,
    public dialog: MatDialog,
    private settingsService : SettingsService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.me = this.getMe();
    this.getBasicRewards();
    this.getDataFromSettings();
  }

  getMe(): FamilyUser {
    return this.familyService.familyUser;
  }

  getDataFromSettings() {
    this.isParent = this.settingsService.isParent;
    this.settings = this.settingsService.settings;
  }

  getBasicRewards() {
    this.rewardsService.getRewardsBasic().subscribe((res) => {
      this.basicRewards = res.data.rewards;
      // console.log(this.basicRewards)
      this.isLoading = false;
    });
  }

  canUnlock(reward: Reward): Boolean {
    return this.me.points >= reward.points ? true : false;
  }

  editReward(reward: Reward) {
    this.router.navigate(['', 'app', 'rewards', 'add'], {
      queryParams: { id: reward._id },
    });
  }

  unlockReward(reward: Reward) {
    const dialogRef = this.dialog.open(UnlockRewardComponent, {
      data: {
        reward: reward,
        points: this.me.points,
      },
      autoFocus: false,
      restoreFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createReward(reward);
      }
    });
  }

  createReward(reward: Reward) {
    this.isLoading = true;
    let newReward: Reward = {
      name: reward.name,
      points: reward.points,
      unlockedAt: new Date(),
      unlockedBy: this.me._id,
      confirmed: false,
    };
    this.rewardsService.unlockReward(newReward).subscribe((res) => {
      this.familyService.familyUser.points = this.me.points - newReward.points;
      this.me = this.getMe();
      this.unlockedInfo = true;
      this.isLoading = false;
    });
  }
  deleteRewardConfirm(reward: Reward){

  }
}
