import { FamilyService } from './../../family.service';
import { DailyTask } from './../../utils/tasks.models';
import { TasksService } from './../tasks.service';
import { Component, OnInit } from '@angular/core';
import { FamilyUser } from 'src/app/utils/family.models';

@Component({
  selector: 'app-daily-task',
  templateUrl: './daily-task.component.html',
  styleUrls: ['./daily-task.component.scss'],
})
export class DailyTaskComponent implements OnInit {
  isLoading = false;
  dailyTasks: DailyTask[];

  children: FamilyUser[] = [];

  date: Date = new Date();

  constructor(
    private tasksService: TasksService,
    private familyService: FamilyService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.familyService.family.users.forEach((el) => {
      el.role == 'child' ? this.children.push(el) : null;
    });

    this.tasksService.getDailyTasks().subscribe((res) => {
      this.dailyTasks = res.data.dailyTasks;
      this.isLoading = false;
    });
  }
}
