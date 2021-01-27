import { Router, ActivatedRoute } from '@angular/router';
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

  familyChildren: TaskUser[] = [];

  taskFormGroup: FormGroup;

  taskToUpdate: string;

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
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.initFormGroup();
    this.fillFamilyMembers();
    this.checkQueryParams();
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

  checkQueryParams() {
    this.route.queryParams.subscribe((param) => {
      if (param.id) {
        this.isLoading = true;
        this.taskService.getSingleTask(param.id).subscribe(
          (res) => {
            this.editMode = true;
            this.taskToUpdate = param.id;
            this.fillTaskData(res.data.task);
            this.isLoading = false;
          },
          (err) => {
            this.router.navigate(['', 'app', 'tasks']);
          }
        );
      } else {
        this.isLoading = false;
      }
    });
  }

  fillTaskData(task: Task) {
    this.taskFormGroup.get('name').setValue(task.name);
    this.taskFormGroup.get('points').setValue(task.points);

    for (let i = 0; i < task.users.length; i++) {
      for (let k = 0; k < this.familyChildren.length; k++) {
        if (task.users[i].user._id == this.familyChildren[k].user._id) {
          if (task.users[i].abandoned || task.users[i].completed) {
            this.familyChildren.splice(k, 1);
          } else {
            this.familyChildren[k].isSelected = true;
            this.taskFormGroup.get('isSomeoneSelected').setValue(true);
          }
        }
      }
    }

    let date = new Date(task.startDate).setHours(0, 0, 0, 0);

    this.taskFormGroup.get('startDate').setValue(new Date(date));

    let startHours = this.parseNumberToString(
      new Date(task.startDate).getHours()
    );
    let startMinutes = this.parseNumberToString(
      new Date(task.startDate).getMinutes()
    );
    let endHours = this.parseNumberToString(new Date(task.endDate).getHours());
    let endMinutes = this.parseNumberToString(
      new Date(task.endDate).getMinutes()
    );
    if (
      startHours == '00' &&
      startMinutes == '00' &&
      endHours == '23' &&
      endMinutes == '59'
    ) {
      this.taskFormGroup.get('allDay').setValue(true);
      this.allDayChange({ checked: true });
    } else {
      this.taskFormGroup
        .get('startTime')
        .setValue(`${startHours}:${startMinutes}`);

      this.taskFormGroup.get('endTime').setValue(`${endHours}:${endMinutes}`);
    }
  }

  parseNumberToString(number: Number) {
    if (number < 10) {
      return `0${number}`;
    } else {
      return number;
    }
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
    if (this.taskFormGroup.controls.isSomeoneSelected.invalid) {
      this.assignError = true;
    }
    if (this.taskFormGroup.controls.name.invalid) {
      this.familyService.scrollSub.next({ top: 0, duration: 1000 });
      return;
    } else if (this.taskFormGroup.controls.isSomeoneSelected.invalid) {
      this.familyService.scrollSub.next({ top: 200, duration: 1000 });
      return;
    } else if (this.taskFormGroup.invalid) {
      return;
    } else if (this.editMode) {
      this.editTask();
    } else {
      this.addTask();
    }
  }

  getTaskFromForm(): Task {
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
    return task;
  }

  addTask() {
    this.isLoading = true;

    let task = this.getTaskFromForm();

    this.taskService.addTask(task).subscribe(
      (res) => {
        this.router.navigate(['', 'app', 'tasks']);
      },
      (err) => {
        this.error = true;
      }
    );
  }

  editTask() {
    this.isLoading = true;

    let task = this.getTaskFromForm();

    this.taskService.editSingleTask(this.taskToUpdate, task).subscribe(
      (res) => {
        this.router.navigate(['', 'app', 'tasks']);
      },
      (err) => {
        this.error = true;
      }
    );
  }
}
