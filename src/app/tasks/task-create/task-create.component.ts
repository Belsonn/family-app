import { Router } from '@angular/router';
import { TasksService } from './../tasks.service';
import { Task, TaskUser } from './../../utils/tasks.models';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { FamilyService } from './../../family.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { pickerTheme } from 'src/app/utils/TimePickerTheme';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss'],
})
export class TaskCreateComponent implements OnInit {
  isLoading = false;
  error: boolean = false;

  color: string;

  familyChildren: TaskUser[] = [];

  taskFormGroup: FormGroup;

  rewardBoxes = [5, 10, 20, 25, 50, 100];

  editMode = false;

  assignError = false;
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

    this.isLoading = false;
  }

  initFormGroup() {
    this.taskFormGroup = this._formBuilder.group({
      name: ['', Validators.required],
      points: [0, Validators.min(0)],
      allDay: [''],
      isSomeoneSelected: [false, Validators.requiredTrue],
      startDate: [null, Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
    });
  }

  fillFamilyMembers() {
    this.familyService.family.users.map((user) => {
      if (user.role == 'child') {
        this.familyChildren.push({
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
      ? this.taskFormGroup.get('isSomeoneSelected').setValue(true)
      : this.taskFormGroup.get('isSomeoneSelected').setValue(false);
  }

  onSelectUser(familyUser) {
    this.assignError = false;
    familyUser.isSelected = !familyUser.isSelected;
    this.checkSomeoneSelected();
  }
  onSelectAll() {
    this.assignError = false;
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
        this.taskFormGroup
          .get('points')
          .patchValue(this.taskFormGroup.controls.points.value - 1);
        this.checkValid();
      }, 150);
    }
    if (mark == 'plus') {
      this.timeoutHandler = setInterval(() => {
        this.taskFormGroup
          .get('points')
          .patchValue(this.taskFormGroup.controls.points.value + 1);
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
      this.taskFormGroup
        .get('points')
        .patchValue(this.taskFormGroup.controls.points.value - 1);
      this.checkValid();
    }
    if (mark == 'plus') {
      this.taskFormGroup
        .get('points')
        .patchValue(this.taskFormGroup.controls.points.value + 1);
    }
  }

  checkValid() {
    this.pointsTouched = true;
    let value = this.taskFormGroup.controls.points.value;
    if (value < 0) {
      value = 0;
    }
    value = Math.trunc(value);
    this.taskFormGroup.get('points').patchValue(value);
  }

  fillPoints(points: Number) {
    this.taskFormGroup.get('points').setValue(points);
  }

  allDayChange(event) {
    if (event.checked) {
      this.taskFormGroup.get('startTime').disable();
      this.taskFormGroup.get('endTime').disable();
    } else {
      this.taskFormGroup.get('startTime').enable();
      this.taskFormGroup.get('endTime').enable();
    }
  }

  checkModeAndSubmit() {
    console.log(this.taskFormGroup);
    if (this.taskFormGroup.controls.isSomeoneSelected.invalid) {
      this.assignError = true;
    }
    if (this.taskFormGroup.controls.name.invalid) {
      this.familyService.scrollSub.next({ top: 0, duration: 1000 });
      return;
    } else if (this.taskFormGroup.controls.isSomeoneSelected.invalid) {
      this.familyService.scrollSub.next({ top: 100, duration: 1000 });
      return;
    } else if (this.taskFormGroup.invalid) {
      return;
    } else if (this.editMode) {
      // this.editDailyTask();
    } else {
      this.addTask();
    }
  }

  addTask() {
    this.isLoading = true;

    let task: Task = {
      name: this.taskFormGroup.controls.name.value,
      dailyTask: null,
      points: this.taskFormGroup.controls.points.value,
      startDate: new Date(this.taskFormGroup.controls.startDate.value),
      endDate: new Date(this.taskFormGroup.controls.startDate.value),
      users: [],
    };

    this.familyChildren.forEach((el) => {
      el.isSelected
        ? task.users.push({
            user: el.user._id,
          })
        : null;
    });

    if (this.taskFormGroup.controls.allDay.value) {
      task.endDate.setHours(23, 59, 59, 999);
    } else {
      let startTime = this.taskFormGroup.controls.startTime.value.split(':');
      let endTime = this.taskFormGroup.controls.endTime.value.split(':');
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
