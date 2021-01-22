import { Router } from '@angular/router';
import { TasksService } from './../tasks.service';
import { Task } from './../../utils/tasks.models';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { FamilyService } from './../../family.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CalendarUser } from 'src/app/utils/CalendarEvent.model';
import { pickerTheme } from 'src/app/utils/TimePickerTheme';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss'],
})
export class TaskCreateComponent implements OnInit {
  true = true;
  apply = $localize`Apply`;
  isLoading = false;
  error: boolean = false;

  color: string;

  familyParents: CalendarUser[] = [];
  familyChildren: CalendarUser[] = [];

  titleFormGroup: FormGroup;
  assignFormGroup: FormGroup;
  rewardFormGroup: FormGroup;
  datesFormGroup: FormGroup;

  rewardBoxes = [5, 10, 20, 25, 50, 100];

  assignTouched = false;
  pointsTouched = false;
  minDate = new Date();
  pickerTheme: NgxMaterialTimepickerTheme = pickerTheme;
  timeoutHandler;

  constructor(
    private _formBuilder: FormBuilder,
    private familyService: FamilyService,
    private taskService: TasksService,
    private router: Router
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
      commonTaskControl: [false],
    });
    this.assignFormGroup = this._formBuilder.group({
      isSomeoneSelected: [false, Validators.requiredTrue],
    });
    this.rewardFormGroup = this._formBuilder.group({
      points: [0, Validators.min(0)],
    });
    this.datesFormGroup = this._formBuilder.group({
      allDayControl: [false],
      startDateControl: ['', Validators.required],
      endDateControl: ['', Validators.required],
      startTimeControl: [null, Validators.required],
      endTimeControl: [null, Validators.required],
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
  onTest() {
    console.log(window);
  }

  fillPoints(points: Number) {
    this.rewardFormGroup.get('points').setValue(points);
  }

  allDayChange(event) {
    if (event.checked) {
      this.datesFormGroup.get('startTimeControl').disable();
      this.datesFormGroup.get('endTimeControl').disable();
    } else {
      this.datesFormGroup.get('startTimeControl').enable();
      this.datesFormGroup.get('endTimeControl').enable();
    }
  }

  addTask() {
    let task: Task = {
      name: this.titleFormGroup.controls.title.value,
      dailyTask: null,
      points: this.rewardFormGroup.controls.points.value,
      startDate: new Date(this.datesFormGroup.controls.startDateControl.value),
      endDate: new Date(this.datesFormGroup.controls.endDateControl.value),
      users: [],
    };

    this.familyChildren.forEach((el) => {
      el.isSelected
        ? task.users.push({
            user: el.user._id,
          })
        : null;
    });

    if (this.datesFormGroup.controls.allDayControl.value) {
      task.endDate.setHours(23, 59, 59, 999);
    } else {
      let startTime = this.datesFormGroup.controls.startTimeControl.value.split(
        ':'
      );
      let endTime = this.datesFormGroup.controls.endTimeControl.value.split(
        ':'
      );
      task.startDate.setHours(startTime[0], startTime[1]);
      task.endDate.setHours(endTime[0], endTime[1]);
    }

    this.taskService.addTask(task).subscribe(
      (res) => {
        this.router.navigate(['', 'app', 'tasks']);
      },
      (err) => {
        this.error = true;
      }
    );
  }
}
