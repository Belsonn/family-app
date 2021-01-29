import { ConfirmRewardComponent } from './../dialogs/confirm-reward/confirm-reward.component';
import { MatDialog } from '@angular/material/dialog';
import { FamilyService } from 'src/app/family.service';
import { RewardsService } from './../rewards.service';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  AfterViewInit,
} from '@angular/core';
import { Reward } from 'src/app/utils/reward.models';

@Component({
  selector: 'app-rewards-unlocked',
  templateUrl: './rewards-unlocked.component.html',
  styleUrls: ['./rewards-unlocked.component.scss'],
})
export class RewardsUnlockedComponent implements OnInit, AfterViewInit {
  isLoading = false;

  showConfirmed: Boolean = false;

  rewardsUnlocked: Reward[];
  rewardsConfirmed: Reward[];

  confirmedClickedOnce: Boolean = false;

  @ViewChildren('scroll') scrollHeight: QueryList<ElementRef>;
  toScroll;

  constructor(
    private rewardsService: RewardsService,
    private familyService: FamilyService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.getRewards();
  }

  ngAfterViewInit(): void {
    this.scrollHeight.changes.subscribe((scrollHeight) => {
      if (scrollHeight && scrollHeight.first) {
        this.toScroll = scrollHeight.first.nativeElement.offsetHeight;
      } else {
        this.toScroll = 0;
      }
    });
  }

  getRewards() {
    this.rewardsService.getRewardsUnlocked().subscribe((res) => {
      this.rewardsUnlocked = res.data.rewardsUnlocked;
      this.rewardsConfirmed = res.data.rewardsConfirmed;
      console.log(this.rewardsUnlocked);
      console.log(this.rewardsConfirmed);
      this.isLoading = false;
    });
  }

  confirmOpen(reward: Reward) {
    const dialogRef = this.dialog.open(ConfirmRewardComponent, {
      autoFocus: false,
      restoreFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.confirmReward(reward);
      }
    });
  }

  confirmReward(reward: Reward) {
    this.isLoading = true;
    let newReward = reward;
    newReward.confirmed = true;

    this.rewardsService.updateReward(reward._id, newReward).subscribe((res) => {
      this.getRewards();
    });
  }

  showConfirmedClick() {
    this.confirmedClickedOnce = true;
    if (this.showConfirmed) {
      this.showConfirmed = !this.showConfirmed;
      this.familyService.scrollSub.next({ top: 0, duration: 800 });
    } else {
      this.showConfirmed = !this.showConfirmed;
      this.familyService.scrollSub.next({
        top: this.toScroll,
        duration: Math.max(this.toScroll, 800),
      });
    }
  }
}
