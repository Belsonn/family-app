import { AbandonTaskComponent } from './CompleteAbandon/abandon-task/abandon-task.component';
import { CompleteTaskComponent } from './CompleteAbandon/complete-task/complete-task.component';
import { MatDialog } from '@angular/material/dialog';
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
  tasksCompleted: Task[] = [];

  children: FamilyUser[] = [];

  constructor(
    private taskService: TasksService,
    private familyService: FamilyService,
    public dialog: MatDialog
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
      this.selectChanged({ value: this.me.name });
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
    let tasksActive: Task[] = [];
    let tasksCompleted: Task[] = [];

    for (let i = 0; i < this.tasks.length; i++) {
      for (let k = 0; k < this.tasks[i].users.length; k++) {
        if (
          this.tasks[i].users[k].user.name == selection.value &&
          (this.tasks[i].users[k].completed || this.tasks[i].users[k].abandoned)
        ) {

          tasksCompleted.push(this.tasks[i]);

        } else if (this.tasks[i].users[k].user.name == selection.value) {
          
          tasksActive.push(this.tasks[i]);
        }
      }
    }

    // if (tasks.length == 0) {
    //   tasks = this.tasks;
    // }
    this.tasksToShow = tasksActive;
    this.tasksCompleted = tasksCompleted.slice().reverse();

    console.log("Completed", this.tasksCompleted)
    console.log("Active", this.tasksToShow)
  }

  showDate(index, array: string) {
    if (index == 0) {
      return true;
    }
    let lastEventStartDate;
    let thisEventStartDate;
    if(array == 'active'){

      lastEventStartDate = new Date(
        this.tasksToShow[index - 1].startDate
      ).setHours(0, 0, 0, 0);

      thisEventStartDate = new Date(
        this.tasksToShow[index].startDate
      ).setHours(0, 0, 0, 0);

    } else if(array == 'complete') {

      lastEventStartDate = new Date(
        this.tasksCompleted[index - 1].startDate
      ).setHours(0, 0, 0, 0);

      thisEventStartDate = new Date(
        this.tasksCompleted[index].startDate
      ).setHours(0, 0, 0, 0);

    }

    if (lastEventStartDate !== thisEventStartDate) {
      return true;
    } else {
      return false;
    }
  }

  showCompleteMenu(task: Task) {
    let show = false;

    let userInTask = false;
    let taskIsNotCompleteAndAbandonded = false;

    for (let i = 0; i < task.users.length; i++) {
      if (task.users[i].user._id == this.me._id) {
        userInTask = true;
        if (!task.users[i].abandoned && !task.users[i].completed) {
          taskIsNotCompleteAndAbandonded = true;
        }
      }
    }

    userInTask && taskIsNotCompleteAndAbandonded
      ? (show = true)
      : (show = false);

    return show;
  }

  confirmTask(task: Task) {
    const dialogRef = this.dialog.open(CompleteTaskComponent, {
      data: task,
      autoFocus: false,
      restoreFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.changeTaskStatus(task, 'complete');
      }
    });
  }

  abandonTask(task: Task) {
    const dialogRef = this.dialog.open(AbandonTaskComponent, {
      data: task,
      autoFocus: false,
      restoreFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.changeTaskStatus(task, 'abandon');
      }
    });
  }

  changeTaskStatus(task: Task, status) {
    this.isLoading = true;
    for (let i = 0; i < task.users.length; i++) {
      if (task.users[i].user._id == this.me._id) {
        if (status === 'abandon') {
          task.users[i].abandoned = true;
        } else if (status === 'complete') {
          task.users[i].completed = true;
          this.me.points += task.points;
          this.familyService.familyUser = this.me;
        }
        task.users[i].completedAt = new Date();
      }
    }
    this.taskService.setTaskStatus(task, this.me.points).subscribe((res) => {
      this.tasks = res.data.tasks;
      this.tasksToShow = this.tasks;
      this.checkMyRole();
      this.isLoading = false;
    });
  }
}
