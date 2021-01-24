import { FamilyService } from './../../family.service';
import { DailyTask, Task } from './../../utils/tasks.models';
import { TasksService } from './../tasks.service';
import { Component, OnInit } from '@angular/core';
import { FamilyUser } from 'src/app/utils/family.models';

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

  date: Date = new Date();

  constructor(
    private tasksService: TasksService,
    private familyService: FamilyService
  ) {}

  ngOnInit(): void {
    this.getDailyTaskOnDate();
    
    this.findChildren();
    
  }

  findChildren(){
    this.familyService.family.users.forEach((el) => {
      el.role == 'child' ? this.children.push(el) : null;
    });
  }



  getDailyTaskOnDate() {
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
      // console.log('TASK TO CREATE', this.tasksToCreate);
      // console.log('Taski dnia', this.taskOnDate);
      this.isLoading = false;
    });
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

  changeUser(dailyTask: Task, child: FamilyUser) {
    if (this.checkDateInPast()) {
      return;
    } else {
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
    this.isLoading = true;

    this.date.setDate(this.date.getDate() - 1);

    this.getDailyTaskOnDate();
  }
  dateTommorow() {
    this.isLoading = true;

    this.date.setDate(this.date.getDate() + 1);

    this.getDailyTaskOnDate();
  }

  updateDailyTasks() {
    if (this.checkDateInPast()) {
      return;
    } else {
      this.isLoading = true;
      this.tasksService
        .updateDailyTasks(this.date, this.tasksToCreate)
        .subscribe((res) => {
          this.isLoading = false;
        });
    }
  }
}
