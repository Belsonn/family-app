import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'src/app/utils/CalendarEvent.model';
import { CalendarService } from '../calendar.service';

@Component({
  selector: 'app-upcoming-events',
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.scss'],
})
export class UpcomingEventsComponent implements OnInit {
  isEventsLoading = false;
  events: CalendarEvent[];

  constructor(private calendarService: CalendarService) {}

  ngOnInit(): void {
    this.isEventsLoading = true;
    this.getEvents(4, true);
  }

  private getEvents(limit: number, upcoming: boolean) {
    this.calendarService.getEvents(limit, upcoming).subscribe((res) => {
      this.events = res.data.events;
      console.log(this.events);
      this.isEventsLoading = false;
    });
  }
}
