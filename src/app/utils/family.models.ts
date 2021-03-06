import { Settings } from './settings.models';
import { Message } from './chat.models';
import { Reward } from './reward.models';
import { CalendarEvent } from './CalendarEvent.model';
import { ShoppingList } from './shoppingList.models';
import { Task } from './tasks.models';

export interface FamilyUser {
  _id: string;
  name: string;
  family: string;
  gender: string;
  points: number,
  dateOfBirth: Date;
  photo: string;
  role: string;
  user: string;
}

export interface Family {
  users: [FamilyUser];
  _id: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  inviteToken: string;
  shoppingLists?: ShoppingList[];
  events?: CalendarEvent[];
  tasks?: Task[];
  rewards?: Reward[];
  messages?: Message[];
  settings?: Settings;
}

export interface FamilyResponse {
  status: string;
  data: {
    family: Family;
  };
}
export interface MeAndFamilyResponse {
  status: string;
  data: {
    familyUser: FamilyUser;
    family: Family;
  };
}
export interface existsResponse {
  status: string;
  data: {
    exists: boolean;
    familyId: string;
  };
}
export interface createFamilyResponse {
  status: string;
  data: {
    family: Family;
    user: string;
  };
}

export interface FamilyUserResponse {
  status: string;
  data: {
    familyUser: FamilyUser;
  };
}
export interface FamilyUserResponse2 {
  status: string;
  data: {
    user: FamilyUser;
  };
}

