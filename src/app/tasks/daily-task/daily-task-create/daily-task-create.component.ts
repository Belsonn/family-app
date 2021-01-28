import { ConfirmDeleteDailyTaskComponent } from './../confirm-delete-daily-task/confirm-delete-daily-task.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TasksService } from './../../tasks.service';
import { FamilyService } from './../../../family.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { pickerTheme } from 'src/app/utils/TimePickerTheme';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { DailyTask } from 'src/app/utils/tasks.models';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-daily-task-create',
  templateUrl: './daily-task-create.component.html',
  styleUrls: ['./daily-task-create.component.scss'],
})
export class DailyTaskCreateComponent implements OnInit {
  isLoading = false;

  dailyTaskFormGroup: FormGroup;

  editMode: boolean = false;
  dailyToUpdate: string;

  timeoutHandler;
  pointsTouched: Boolean = false;
  rewardBoxes = [5, 10, 20, 25, 50, 100];
  pickerTheme: NgxMaterialTimepickerTheme = pickerTheme;

  constructor(
    private _formBuilder: FormBuilder,
    private taskService: TasksService,
    private familyService: FamilyService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
    this.checkQueryParams();
  }

  initFormGroup() {
    this.dailyTaskFormGroup = this._formBuilder.group({
      name: ['', Validators.required],
      points: [0, Validators.min(0)],
      allDay: [''],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
    });
  }

  checkQueryParams() {
    this.route.queryParams.subscribe((param) => {
      if (param.id) {
        this.isLoading = true;
        this.taskService.getDailyTask(param.id).subscribe(
          (res) => {
            this.editMode = true;
            this.dailyToUpdate = param.id;
            this.fillTaskData(res.data.dailyTask);
            this.isLoading = false;
          },
          (err) => {
            this.router.navigate(['', 'app', 'tasks', 'daily']);
          }
        );
      }
    });
  }

  fillTaskData(dailyTask: DailyTask) {
    this.dailyTaskFormGroup.get('name').setValue(dailyTask.name);
    this.dailyTaskFormGroup.get('points').setValue(dailyTask.points);
    this.dailyTaskFormGroup.get('startTime').setValue(dailyTask.startTime);
    this.dailyTaskFormGroup.get('endTime').setValue(dailyTask.endTime);
  }

  onHold(mark: string) {
    this.pointsTouched = true;
    if (mark == 'minus') {
      this.timeoutHandler = setInterval(() => {
        this.dailyTaskFormGroup
          .get('points')
          .patchValue(this.dailyTaskFormGroup.controls.points.value - 1);
        this.checkValid();
      }, 150);
    }
    if (mark == 'plus') {
      this.timeoutHandler = setInterval(() => {
        this.dailyTaskFormGroup
          .get('points')
          .patchValue(this.dailyTaskFormGroup.controls.points.value + 1);
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
      this.dailyTaskFormGroup
        .get('points')
        .patchValue(this.dailyTaskFormGroup.controls.points.value - 1);
      this.checkValid();
    }
    if (mark == 'plus') {
      this.dailyTaskFormGroup
        .get('points')
        .patchValue(this.dailyTaskFormGroup.controls.points.value + 1);
    }
  }

  checkValid() {
    this.pointsTouched = true;
    let value = this.dailyTaskFormGroup.controls.points.value;
    if (value < 0) {
      value = 0;
    }
    value = Math.trunc(value);
    this.dailyTaskFormGroup.get('points').patchValue(value);
  }

  allDayChange(event) {
    if (event.checked) {
      this.dailyTaskFormGroup.get('startTime').disable();
      this.dailyTaskFormGroup.get('endTime').disable();
    } else {
      this.dailyTaskFormGroup.get('startTime').enable();
      this.dailyTaskFormGroup.get('endTime').enable();
    }
  }

  fillPoints(points: Number) {
    this.dailyTaskFormGroup.get('points').setValue(points);
  }

  checkModeAndSubmit() {
    if (this.dailyTaskFormGroup.controls.name.invalid) {
      this.familyService.scrollSub.next({ top: 0, duration: 500 });
      return;
    } else if (this.dailyTaskFormGroup.invalid) {
      return;
    } else if (this.editMode) {
      this.editDailyTask();
    } else {
      this.addDailyTask();
    }
  }

  getDailyTaskFromForm(): DailyTask {
    let dailyTask: DailyTask = {
      name: this.dailyTaskFormGroup.controls.name.value,
      points: this.dailyTaskFormGroup.controls.points.value,
      startTime: null,
      endTime: null,
    };

    if (!this.dailyTaskFormGroup.controls.allDay.value) {
      (dailyTask.startTime = this.dailyTaskFormGroup.controls.startTime.value),
        (dailyTask.endTime = this.dailyTaskFormGroup.controls.endTime.value);
    } else {
      (dailyTask.startTime = '00:00'), (dailyTask.endTime = '23:59');
    }
    return dailyTask;
  }

  editDailyTask() {
    let dailyTask = this.getDailyTaskFromForm();

    this.taskService
      .editDailyTaskData(this.dailyToUpdate, dailyTask)
      .subscribe((res) => {
        this.router.navigate(['', 'app', 'tasks', 'daily']);
      });
  }

  addDailyTask() {
    let dailyTask = this.getDailyTaskFromForm();

    this.taskService.addDailyTask(dailyTask).subscribe((res) => {
      this.router.navigate(['', 'app', 'tasks', 'daily']);
    });
  }

  deleteTaskConfirm() {
    const dialogRef = this.dialog.open(ConfirmDeleteDailyTaskComponent, {
      autoFocus: false,
      restoreFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskService
          .deleteDailyTask(this.dailyToUpdate)
          .subscribe((res) => {
            this.router.navigate(['', 'app', 'tasks', 'daily']);
          });
      }
    });
  }
}
