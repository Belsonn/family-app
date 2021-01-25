import { Task } from './../../../utils/tasks.models';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-complete-task',
  templateUrl: './complete-task.component.html',
  styleUrls: ['./complete-task.component.scss'],
})
export class CompleteTaskComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Task) {}

  ngOnInit(): void {
  }

  isSingleDayTask() {
    let startDate = new Date(this.data.startDate).setHours(0, 0, 0, 0);
    let endDate = new Date(this.data.endDate).setHours(0, 0, 0, 0);

    return startDate === endDate ? true : false;
  }
}
