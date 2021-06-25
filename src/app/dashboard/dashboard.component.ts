import { CalendarEvent } from 'src/app/utils/CalendarEvent.model';
import { CalendarService } from './../calendar/calendar.service';
import { TasksService } from './../tasks/tasks.service';
import { Task } from './../utils/tasks.models';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isTasksLoading = false;
  isEventsLoading = false;
  tasks: Task[];
  events: CalendarEvent[];

  constructor(
    private tasksService: TasksService,
    private calendarService: CalendarService
  ) {}

  ngOnInit(): void {
    this.isEventsLoading = true;
    this.isTasksLoading = true;
    this.getTasks();
    this.getEvents(4, true);
  }

  private getTasks() {
    this.tasksService.getMyTasks().subscribe((res) => {
      this.tasks = res.data.tasks;
      console.log(this.tasks);
      this.isTasksLoading = false;
    });
  }

  private getEvents(limit: number, upcoming: boolean) {
    this.calendarService.getEvents(limit, upcoming).subscribe((res) => {
      this.events = res.data.events;
      console.log(this.events);
      this.isEventsLoading = false;
    });
  }
}
