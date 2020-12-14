import { FamilyResponse } from './../utils/family.models';
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

  getEvents() {
    return this.http.get<FamilyResponse>(`${environment.apiURL}family/events`);
  }

  addEvent(event : CalendarEvent) {
    return this.http.post<FamilyResponse>(`${environment.apiURL}family/addEvent`, event)
  }
}
