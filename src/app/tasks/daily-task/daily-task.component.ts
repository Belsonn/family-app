import { DailyTaskConfirmChangesComponent } from './daily-task-confirm-changes/daily-task-confirm-changes.component';
import { MatDialog } from '@angular/material/dialog';
import { FamilyService } from './../../family.service';
import { DailyTask, Task } from './../../utils/tasks.models';
import { TasksService } from './../tasks.service';
import { Component, OnInit } from '@angular/core';
import { FamilyUser } from 'src/app/utils/family.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-daily-task',
  templateUrl: './daily-task.component.html',
  styleUrls: ['./daily-task.component.scss'],
})
export class DailyTaskComponent implements OnInit {
  isLoading = true;
  dailyTasks: DailyTask[];

  children: FamilyUser[] = [];

  taskOnDate: Task[] = [];

  tasksToCreate: Task[] = [];

  changes: Boolean = false;

  date: Date

  constructor(
    private tasksService: TasksService,
    private familyService: FamilyService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.date = new Date();
    this.getDailyTaskOnDate();
    this.findChildren();
  }

  findChildren() {
    this.familyService.family.users.forEach((el) => {
      el.role == 'child' ? this.children.push(el) : null;
    });
  }

  getDailyTaskOnDate() {
    this.isLoading = true;
    this.tasksService.getDailyTasksOnDate(this.date).subscribe((res) => {
      this.taskOnDate = res.data.tasks;

      this.getDailyTask();
    });
  }

  getDailyTask() {
    this.isLoading = true;
    this.tasksService.getDailyTasks().subscribe((res) => {
      this.dailyTasks = res.data.dailyTasks;

      this.createTaskToCreate();
      this.isLoading = false;
    });
  }

  onDateChange(event) {
    this.openConfirmChanges(event.value);
  }

  createTaskToCreate() {
    this.tasksToCreate = [];

    for (let i = 0; i < this.dailyTasks.length; i++) {
      let task: Task = null;
      task = {
        name: this.dailyTasks[i].name,
        startDate: new Date(this.date),
        endDate: new Date(this.date),
        points: this.dailyTasks[i].points,
        dailyTask: this.dailyTasks[i]._id,
        users: [],
      };

      task = this.fillUsers(task);

      const startTime = this.dailyTasks[i].startTime.split(':');
      const endTime = this.dailyTasks[i].endTime.split(':');

      task.startDate.setHours(
        parseInt(startTime[0]),
        parseInt(startTime[1]),
        0,
        0
      );
      task.endDate.setHours(parseInt(endTime[0]), parseInt(endTime[1]), 0, 0);

      this.tasksToCreate.push(task);
    }
  }

  fillUsers(task: Task) {
    for (let i = 0; i < this.taskOnDate.length; i++) {
      if (this.taskOnDate[i].dailyTask == task.dailyTask) {
        this.taskOnDate[i].users.forEach((el) => {
          task.users.push({
            user: el.user._id,
            completed: el.completed,
            completedAt: el.completedAt,
          });
        });
      }
    }
    return task;
  }

  userOnList(dailyTask: Task, child: FamilyUser) {
    let exists = false;

    dailyTask.users.forEach((el) => {
      if (el.user == child._id) {
        exists = true;
      }
    });

    return exists;
  }

  openConfirmChanges(date: Date) {
    if (this.changes) {
      const dialogRef = this.dialog.open(DailyTaskConfirmChangesComponent, {
        autoFocus: false,
        restoreFocus: false,
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.changes = false;
        if (result) {
          this.updateDailyTasks(date);
        } else {
          this.date = date;
          this.getDailyTaskOnDate();
        }
      });
    } else{
      this.date = date;
      this.getDailyTaskOnDate();
    }
  }

  changeUser(dailyTask: Task, child: FamilyUser) {
    if (this.checkDateInPast()) {
      return;
    } else {
      this.changes = true;
      let index = -1;

      for (let i = 0; i < dailyTask.users.length; i++) {
        if (dailyTask.users[i].user == child._id) {
          index = i;
        }
      }

      if (index !== -1) {
        dailyTask.users.splice(index, 1);
      } else {
        dailyTask.users.push({
          completed: false,
          completedAt: null,
          user: child._id,
        });
      }
    }
  }

  checkDateInPast() {
    let now = new Date().setHours(0, 0, 0, 0);
    let provided = new Date(this.date).setHours(0, 0, 0, 0);

    return now > provided ? true : false;
  }

  dateYesterday() {
    let newDate = new Date(this.date);
    newDate.setDate(newDate.getDate() - 1)
    this.openConfirmChanges(newDate);
  }
  dateTommorow() {
    let newDate = new Date(this.date);
    newDate.setDate(newDate.getDate() + 1)
    this.openConfirmChanges(newDate);
  }

  updateDailyTasks(date? : Date) {
    if (this.checkDateInPast()) {
      return;
    } else {
      this.isLoading = true;
      this.tasksService
        .updateDailyTasks(this.date, this.tasksToCreate)
        .subscribe((res) => {
          this.isLoading = false;
          if(date){
            this.date = date;
            this.getDailyTaskOnDate();
          }
        });
    }
  }
  editDailyTask(dailyTask: Task) {
    this.router.navigate(['', 'app', 'tasks', 'daily', 'add'], {
      queryParams: { id: dailyTask.dailyTask },
    });
  }
}
