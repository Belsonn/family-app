import { FamilyUser } from './family.models';

export interface CalendarEvent {
  _id?: string;
  name: string;
  startDate: Date;
  endDate: Date;
}

export interface EventsResponse {
  status: string;
  results: Number;
  data: {
    events: CalendarEvent[];
  };
}
export interface EventResponse {
  status: string;
  data: {
    event: CalendarEvent;
  };
}
