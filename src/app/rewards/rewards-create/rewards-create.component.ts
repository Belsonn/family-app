import { ConfirmDeleteRewardComponent } from './../dialogs/confirm-delete-reward/confirm-delete-reward.component';
import { MatDialog } from '@angular/material/dialog';
import { Reward } from './../../utils/reward.models';
import { FamilyService } from './../../family.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RewardsService } from './../rewards.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-rewards-create',
  templateUrl: './rewards-create.component.html',
  styleUrls: ['./rewards-create.component.scss'],
})
export class RewardsCreateComponent implements OnInit {
  isLoading = false;

  editMode = false;
  rewardToUpdate: string;

  timeoutHandler;

  rewardFormGroup: FormGroup;
  rewardBoxes = [25, 50, 100, 200, 500, 1000];

  constructor(
    private _formBuilder: FormBuilder,
    private familyService: FamilyService,
    private rewardsService: RewardsService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.initFormGroup();
    this.checkQueryParams();
  }

  initFormGroup() {
    this.rewardFormGroup = this._formBuilder.group({
      name: ['', Validators.required],
      points: [0, Validators.min(0)],
    });
  }

  checkQueryParams() {
    this.route.queryParams.subscribe((param) => {
      if (param.id) {
        this.isLoading = true;
        this.rewardsService.getSingleReward(param.id).subscribe(
          (res) => {
            this.editMode = true;
            this.rewardToUpdate = param.id;
            this.fillRewardData(res.data.reward);
            this.isLoading = false;
          },
          (err) => {
            this.router.navigate(['', 'app', 'rewards']);
          }
        );
      } else {
        this.isLoading = false;
      }
    });
  }

  fillRewardData(reward: Reward) {
    this.rewardFormGroup.get('name').setValue(reward.name);
    this.rewardFormGroup.get('points').setValue(reward.points);
  }

  onHold(mark: string) {
    if (mark == 'minus') {
      this.timeoutHandler = setInterval(() => {
        this.rewardFormGroup
          .get('points')
          .patchValue(this.rewardFormGroup.controls.points.value - 1);
        this.checkValid();
      }, 150);
    }
    if (mark == 'plus') {
      this.timeoutHandler = setInterval(() => {
        this.rewardFormGroup
          .get('points')
          .patchValue(this.rewardFormGroup.controls.points.value + 1);
      }, 150);
    }
  }

  onStopHold() {
    clearInterval(this.timeoutHandler);
    this.timeoutHandler = null;
  }

  onMarkClick(mark) {
    this.onStopHold();
    if (mark == 'minus') {
      this.rewardFormGroup
        .get('points')
        .patchValue(this.rewardFormGroup.controls.points.value - 1);
      this.checkValid();
    }
    if (mark == 'plus') {
      this.rewardFormGroup
        .get('points')
        .patchValue(this.rewardFormGroup.controls.points.value + 1);
    }
  }

  checkValid() {
    let value = this.rewardFormGroup.controls.points.value;
    if (value < 0) {
      value = 0;
    }
    value = Math.trunc(value);
    this.rewardFormGroup.get('points').patchValue(value);
  }

  fillPoints(points: Number) {
    this.rewardFormGroup.get('points').setValue(points);
  }

  checkModeAndSubmit() {
    if (this.rewardFormGroup.controls.name.invalid) {
      this.familyService.scrollSub.next({ top: 0, duration: 1000 });
      return;
    } else if (this.editMode) {
      this.editReward();
    } else {
      this.addReward();
    }
  }

  getRewardFromForm(): Reward {
    let reward: Reward = {
      name: this.rewardFormGroup.controls.name.value,
      points: this.rewardFormGroup.controls.points.value,
    };

    return reward;
  }

  addReward() {
    let reward = this.getRewardFromForm();

    this.isLoading = true;

    this.rewardsService.addNewReward(reward).subscribe((res) => {
      this.router.navigate(['', 'app', 'rewards']);
    });
  }

  editReward() {
    let reward = this.getRewardFromForm();

    this.isLoading = true;

    this.rewardsService
      .updateReward(this.rewardToUpdate, reward)
      .subscribe((res) => {
        this.router.navigate(['', 'app', 'rewards']);
      });
  }

  deleteRewardConfirm() {
    const dialogRef = this.dialog.open(ConfirmDeleteRewardComponent, {
      autoFocus: false,
      restoreFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.rewardsService
          .deleteReward(this.rewardToUpdate)
          .subscribe((res) => {
            this.router.navigate(['', 'app', 'rewards']);
          });
      }
    });
  }
}
