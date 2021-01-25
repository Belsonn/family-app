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

