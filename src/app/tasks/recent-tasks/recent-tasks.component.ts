import { Task } from './../../utils/tasks.models';
import { Component, OnInit } from '@angular/core';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-recent-tasks',
  templateUrl: './recent-tasks.component.html',
  styleUrls: ['./recent-tasks.component.scss'],
})
export class RecentTasksComponent implements OnInit {
  isTasksLoading = false;
  tasks: Task[];

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.isTasksLoading = true;
    this.getTasks();
  }

  private getTasks() {
    this.tasksService.getMyTasks().subscribe((res) => {
      this.tasks = res.data.tasks;
      console.log(this.tasks);
      this.isTasksLoading = false;
    });
  }
}
