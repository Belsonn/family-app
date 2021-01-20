import { FamilyService } from './../../family.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CalendarUser } from 'src/app/utils/CalendarEvent.model';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss'],
})
export class TaskCreateComponent implements OnInit {
  true = true;
  apply = $localize`Apply`;
  isLoading = false;

  color: string;

  familyParents: CalendarUser[] = [];
  familyChildren: CalendarUser[] = [];

  titleFormGroup: FormGroup;
  assignFormGroup: FormGroup;
  rewardFormGroup: FormGroup;

  assignTouched = false;
  pointsTouched = false;
  timeoutHandler;

  constructor(
    private _formBuilder: FormBuilder,
    private familyService: FamilyService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.initFormGroup();
    this.fillFamilyMembers();

    this.color = '#9851b4';
    this.isLoading = false;
  }

  initFormGroup() {
    this.titleFormGroup = this._formBuilder.group({
      title: ['', Validators.required],
    });
    this.assignFormGroup = this._formBuilder.group({
      isSomeoneSelected: [false, Validators.requiredTrue],
    });
    this.rewardFormGroup = this._formBuilder.group({
      points: [0, Validators.min(0)],
    });
  }

  fillFamilyMembers() {
    this.familyService.family.users.map((user) => {
      if (user.role == 'child') {
        this.familyChildren.push({
          user: user,
          isSelected: false,
        });
      } else {
        this.familyParents.push({
          user: user,
          isSelected: false,
        });
      }
    });
  }

  checkSomeoneSelected() {
    let selected = false;
    this.familyChildren.forEach((el) => {
      if (el.isSelected) {
        selected = true;
      }
    });
    selected
      ? this.assignFormGroup.get('isSomeoneSelected').setValue(true)
      : this.assignFormGroup.get('isSomeoneSelected').setValue(false);
  }

  onSelectUser(familyUser) {
    this.assignTouched = false;
    familyUser.isSelected = !familyUser.isSelected;
    this.checkSomeoneSelected();
  }
  onSelectAll() {
    this.assignTouched = false;
    let allSelected = true;
    this.familyChildren.forEach((el) => {
      if (!el.isSelected) {
        allSelected = false;
      }
    });
    if (allSelected) {
      this.familyChildren = this.familyChildren.map((el) => {
        return {
          user: el.user,
          isSelected: !el.isSelected,
        };
      });
    } else {
      this.familyChildren = this.familyChildren.map((el) => {
        return {
          user: el.user,
          isSelected: true,
        };
      });
    }
    this.checkSomeoneSelected();
  }

  onHold(mark: string) {
    this.pointsTouched = true;
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
    this.pointsTouched = true;
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
    this.pointsTouched = true;
    let value = this.rewardFormGroup.controls.points.value;
    if (value < 0) {
      value = 0;
    }
    value = Math.trunc(value);
    this.rewardFormGroup.get('points').patchValue(value);
  }
  onTest(){
    console.log(window)
  }
}
