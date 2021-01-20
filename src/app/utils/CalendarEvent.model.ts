import { FamilyUser } from './family.models';


export interface CalendarEvent {
  _id?: string;
  name: string;
  eventType: string;
  users: any
  startDate: Date;
  endDate: Date;
  allDay: Boolean;
  repeatType: string;
  repeatEvery;
  color: string;
}

export interface EventsResponse {
  status: string;
  results: Number;
  data: {
    events: [CalendarEvent];
  };
}

export interface CalendarUser {
  user: FamilyUser;
  isSelected: Boolean;
}
