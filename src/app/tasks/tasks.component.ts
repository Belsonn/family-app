import { FamilyService } from './../family.service';
import { Task } from './../utils/tasks.models';
import { TasksService } from './tasks.service';
import { Component, OnInit } from '@angular/core';
import { FamilyUser } from '../utils/family.models';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  isLoading: boolean = false;
  tasks: Task[] = [];

  children: FamilyUser[] = [];

  selectOptions = [$localize`Show all`];

  constructor(
    private taskService: TasksService,
    private familyService: FamilyService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.findChildren();
    this.generateSelectOptions();
    this.findAllTasks();

  }

  findAllTasks() {
    this.taskService.getTasks().subscribe((res) => {
      this.tasks = res.data.tasks;
      this.isLoading = false;
    });
  }

  findChildren() {
    this.familyService.family.users.forEach((el) => {
      el.role == 'child' ? this.children.push(el) : null;
    });
  }

  generateSelectOptions() {
    for (let i = 0; i < this.children.length; i++) {
      this.selectOptions.push(this.children[i].name);
    }
  }
}
