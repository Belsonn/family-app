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

      console.log(this.tasksToCreate);
      this.isLoading = false;
    });
  }

  createTaskToCreate() {
    this.dailyTasks.forEach((dailyTask) => {
      let task: Task = {
        name: dailyTask.name,
        startDate: new Date(this.date),
        endDate: new Date(this.date),
        dailyTask: dailyTask._id,
        users: [],
      };

      this.fillUsers(task, dailyTask);

      const startTime = dailyTask.startTime.split(':');
      const endTime = dailyTask.endTime.split(':');

      task.startDate.setHours(
        parseInt(startTime[0]),
        parseInt(startTime[1]),
        0,
        0
      );
      task.endDate.setHours(parseInt(endTime[0]), parseInt(endTime[1]), 0, 0);

      this.tasksToCreate.push(task);
    });
  }

  fillUsers(task: Task, dailyTask: DailyTask) {
    console.log(this.taskOnDate);
    for (let i = 0; i < this.taskOnDate.length; i++) {
      if (task.name == dailyTask.name) {

        this.taskOnDate[i].users.forEach((el) => {
          task.users.push(el.user._id);
        });

        return task;
      }
    }
  }
}
