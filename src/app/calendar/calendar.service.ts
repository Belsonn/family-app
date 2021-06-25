import { FamilyResponse } from './../utils/family.models';
import { EventResponse, EventsResponse } from './../utils/CalendarEvent.model';
import { HttpClient } from '@angular/common/http';
import { FamilyService } from './../family.service';
import { Injectable } from '@angular/core';
import { CalendarEvent } from '../utils/CalendarEvent.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  constructor(private familyService: FamilyService, private http: HttpClient) {}

  calendarEvents: CalendarEvent[] = [];
  dayClicked: Date;

  getEvents(limit: number = -1, upcoming: boolean = false) {
    return this.http.get<EventsResponse>(
      `${environment.apiURL}events/?limit=${limit}&upcoming=${upcoming}`
    );
  }

  addEvent(event: CalendarEvent) {
    return this.http.post<EventsResponse>(
      `${environment.apiURL}events/addEvent`,
      event
    );
  }

  getEvent(id: string) {
    return this.http.get<EventResponse>(
      `${environment.apiURL}events/event/${id}`
    );
  }

  updateEvent(id: string, event: CalendarEvent) {
    return this.http.patch<EventResponse>(
      `${environment.apiURL}events/event/${id}`,
      event
    );
  }

  deleteEvent(id: string) {
    return this.http.delete<EventResponse>(
      `${environment.apiURL}events/event/${id}`
    );
  }
}
