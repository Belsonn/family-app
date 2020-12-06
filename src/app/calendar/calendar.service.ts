import { EventsResponse } from './../utils/CalendarEvent.model';
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

  getEvents(familyId) {
    return this.http.get<EventsResponse>(`${environment.apiURL}family/${familyId}/events`);
  }
}
