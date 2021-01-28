import { FamilyUser } from './../utils/family.models';
import {
  Task,
  TaskResponse,
  DailyTaskResponse,
  DailyTask,
  DailyTasksResponse,
  TasksResponse,
} from './../utils/tasks.models';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

  getTasks() {
    return this.http.get<TasksResponse>(`${environment.apiURL}tasks`);
  }

  getSingleTask(id: string) {
    return this.http.get<TaskResponse>(`${environment.apiURL}tasks/task/${id}`);
  }

  addTask(task: Task) {
    return this.http.post<TasksResponse>(
      `${environment.apiURL}tasks/addTask`,
      task
    );
  }

  editSingleTask(id: string, task: Task) {
    return this.http.patch<TaskResponse>(
      `${environment.apiURL}tasks/task/${id}`,
      task
    );
  }

  getDailyTasksOnDate(date: Date) {
    return this.http.get<TasksResponse>(
      `${environment.apiURL}tasks/dailyWithTask?date=${date.toISOString()}`
    );
  }

  updateDailyTasks(date: Date, tasks: Task[]) {
    return this.http.post<TasksResponse>(
      `${environment.apiURL}tasks/updateDailyTasks?date=${date.toISOString()}`,
      {
        tasks: tasks,
      }
    );
  }
  setTaskStatus(task: Task, points: Number) {
    return this.http.patch<TasksResponse>(
      `${environment.apiURL}tasks/setTaskStatus`,
      {
        task: task,
        points: points,
      }
    );
  }

  getDailyTasks() {
    return this.http.get<DailyTasksResponse>(
      `${environment.apiURL}tasks/daily`
    );
  }
  addDailyTask(task: DailyTask) {
    return this.http.post<DailyTasksResponse>(
      `${environment.apiURL}tasks/addDailyTask`,
      task
    );
  }

  getDailyTask(id: string) {
    return this.http.get<DailyTaskResponse>(
      `${environment.apiURL}tasks/daily/${id}`
    );
  }
  editDailyTaskData(id: string, dailyTask: DailyTask) {
    return this.http.patch<DailyTaskResponse>(
      `${environment.apiURL}tasks/daily/${id}`,
      dailyTask
    );
  }

  deleteDailyTask(id: string){
    return this.http.delete<null>(
      `${environment.apiURL}tasks/daily/${id}`
    );
  }
}
