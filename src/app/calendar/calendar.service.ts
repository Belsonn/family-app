import { Injectable } from '@angular/core';
import { CalendarEvent } from '../utils/CalendarEvent.model';

@Injectable({ providedIn: 'root' })
export class CalendarService {

    calendarEvents: CalendarEvent[] = [];
    dayClicked: Date;

}