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

  selected: any;

  showAll = $localize`Show all`;

  me: FamilyUser;

  tasksToShow: Task[] = [];

  children: FamilyUser[] = [];

  constructor(
    private taskService: TasksService,
    private familyService: FamilyService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.findChildren();
    this.findAllTasks();
  }

  checkMyRole() {
    if (this.familyService.familyUser.role == 'child') {
      this.me = this.familyService.familyUser;

      this.selected = this.me.name;

    }
  }

  findAllTasks() {
    this.taskService.getTasks().subscribe((res) => {
      this.tasks = res.data.tasks;
      this.tasksToShow = this.tasks;
      this.checkMyRole();
      console.log(this.tasks);
      this.isLoading = false;
    });
  }

  findChildren() {
    this.familyService.family.users.forEach((el) => {
      el.role == 'child' ? this.children.push(el) : null;
    });
  }

  selectChanged(selection) {
    let tasks: Task[] = [];

    for (let i = 0; i < this.tasks.length; i++) {
      for (let k = 0; k < this.tasks[i].users.length; k++) {
        if (this.tasks[i].users[k].user.name == selection.value) {
          tasks.push(this.tasks[i]);
        }
      }
    }

    if (tasks.length == 0) {
      tasks = this.tasks;
    }
    this.tasksToShow = tasks;
  }

  showDate(index) {
    if (index == 0) {
      return true;
    }
    let lastEventStartDate = new Date(
      this.tasksToShow[index - 1].startDate
    ).setHours(0, 0, 0, 0);
    let thisEventStartDate = new Date(
      this.tasksToShow[index].startDate
    ).setHours(0, 0, 0, 0);

    if (lastEventStartDate !== thisEventStartDate) {
      return true;
    } else {
      return false;
    }
  }
}
