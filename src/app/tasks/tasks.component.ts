import { Task } from './../utils/tasks.models';
import { TasksService } from './tasks.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  isLoading: boolean = false;
  tasks: Task[] = [];

  constructor(private taskService: TasksService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.taskService.getTasks().subscribe((res) => {
      this.tasks = res.data.tasks;
      console.log(this.tasks);
      this.isLoading = false;
    });
  }
}
