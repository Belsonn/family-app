import { FamilyUser } from './../utils/family.models';
import { Task, TaskResponse, DailyTaskResponse, DailyTask } from './../utils/tasks.models';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

  addTask(task: Task) {
    return this.http.post<TaskResponse>(
      `${environment.apiURL}tasks/addTask`,
      task
    );
  }

  getTasks() {
    return this.http.get<TaskResponse>(`${environment.apiURL}tasks`);
  }

  getDailyTasks() {
    return this.http.get<DailyTaskResponse>(`${environment.apiURL}tasks/daily`);
  }

  getDailyTasksOnDate(date: Date) {
    return this.http.get<TaskResponse>(
      `${environment.apiURL}tasks/dailyWithTask?date=${date.toISOString()}`
    );
  }

  updateDailyTasks(date: Date, tasks: Task[]) {
    return this.http.post<TaskResponse>(
      `${environment.apiURL}tasks/updateDailyTasks?date=${date.toISOString()}`,
      {
        tasks: tasks,
      }
    );
  }
  setTaskStatus(task: Task, points: Number) {
    return this.http.patch<TaskResponse>(
      `${environment.apiURL}tasks/setTaskStatus`,
      {
        task: task,
        points: points
      }
    );
  }

  addDailyTask(task: DailyTask) {
    return this.http.post<DailyTaskResponse>(
      `${environment.apiURL}tasks/addDailyTask`,
      task
    );
  }
}
