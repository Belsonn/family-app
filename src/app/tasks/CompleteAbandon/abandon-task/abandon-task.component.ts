import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from 'src/app/utils/tasks.models';

@Component({
  selector: 'app-abandon-task',
  templateUrl: './abandon-task.component.html',
  styleUrls: ['./abandon-task.component.scss'],
})
export class AbandonTaskComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Task) {}

  ngOnInit(): void {}

  isSingleDayTask() {
    let startDate = new Date(this.data.startDate).setHours(0, 0, 0, 0);
    let endDate = new Date(this.data.endDate).setHours(0, 0, 0, 0);

    return startDate === endDate ? true : false;
  }
}
