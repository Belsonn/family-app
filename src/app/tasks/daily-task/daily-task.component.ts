import { DailyTask } from './../../utils/tasks.models';
import { TasksService } from './../tasks.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-daily-task',
  templateUrl: './daily-task.component.html',
  styleUrls: ['./daily-task.component.scss'],
})
export class DailyTaskComponent implements OnInit {
  isLoading = false;
  dailyTasks: DailyTask[];

  date: Date = new Date(); 

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.tasksService.getDailyTasks().subscribe((res) => {
      this.dailyTasks = res.data.dailyTasks;
      this.isLoading = false;
    });
  }
}
