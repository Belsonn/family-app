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

  timeoutHandler;

  rewardFormGroup: FormGroup;
  rewardBoxes = [25, 50, 100, 200, 500, 1000];

  constructor(
    private _formBuilder: FormBuilder,
    private rewardService: RewardsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
  }

  initFormGroup() {
    this.rewardFormGroup = this._formBuilder.group({
      name: ['', Validators.required],
      points: [0, Validators.min(0)],
    });
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
}
