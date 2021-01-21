import { FamilyUser } from 'src/app/utils/family.models';
export interface Task {
    _id?: string,
    name: string,
    users: {
        completed?: boolean;
        completedAt?: Date,
        _id?: string,
        user: FamilyUser | string
    }[]
    startDate: Date,
    endDate: Date,
    common: boolean
}

export interface TaskResponse {
    status: string,
    results: number,
    data: {
        tasks: Task[]
    }
}

export interface DailyTask {
    _id?: string,
    name: string,
    color: string, 
    points: number,
    startTime: string,
    endTime: string
}

export interface DailyTaskResponse {
    status: string,
    results: number,
    data: {
        dailyTasks: DailyTask[] 
    }
}