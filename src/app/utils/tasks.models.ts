import { FamilyUser } from 'src/app/utils/family.models';
export interface Task {
  _id?: string;
  name: string;
  points: number;
  users: {
    completed?: boolean;
    completedAt?: Date;
    abandoned?: boolean;
    _id?: string;
    user: any; //  FamilyUser | string
  }[];
  startDate: Date;
  endDate: Date;
  dailyTask: string;
}

export interface TaskResponse {
  status: string;
  data: {
    task: Task;
  };
}
export interface TasksResponse {
  status: string;
  results: number;
  data: {
    tasks: Task[];
  };
}

export interface DailyTask {
  _id?: string;
  name: string;
  points: number;
  startTime: string;
  endTime: string;
}

export interface DailyTasksResponse {
  status: string;
  results: number;
  data: {
    dailyTasks: DailyTask[];
  };
}
export interface DailyTaskResponse {
  status: string;
  data: {
    dailyTask: DailyTask;
  };
}

export interface TaskUser {
  user: FamilyUser,
  isSelected: boolean
}
