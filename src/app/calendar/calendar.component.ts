import { FamilyService } from './../family.service';
import { Component, OnInit } from '@angular/core';
import { CalendarDay } from '../utils/CalendarDay.class';
import { CalendarEvent } from '../utils/CalendarEvent.model';
import { MatDialog } from '@angular/material/dialog';

import { CalendarService } from './calendar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  public calendar: CalendarDay[] = [];
  monthSelected: number;

  displayedDate: Date;

  today = new Date().setHours(0, 0, 0, 0);

  isLoading = false;

  private monthIndex: number = 0;
  calendarDayInstance: CalendarDay;
  calendarEvents: CalendarEvent[] = [];
  swipingRight = false;
  swipingLeft = false;
  swipingTimerRight;
  swipingTimerLeft;

  constructor(
    public dialog: MatDialog,
    private calendarService: CalendarService,
    private router: Router,
    private familyService: FamilyService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.calendarService.getEvents().subscribe((res) => {
      let events = res.data.events;

      for (let i = 0; i < res.data.events.length; i++) {
        events[i].startDate = new Date(events[i].startDate);
        events[i].endDate = new Date(events[i].endDate);
      }

      this.calendarEvents = events;

      this.generateCalendarDays(this.monthIndex);
      this.monthSelected = new Date().getMonth();
      this.isLoading = false;
    });
  }

  private generateCalendarDays(monthIndex: number): void {
    // we reset our calendar
    this.calendar = [];

    // we set the date
    this.displayedDate = new Date(
      new Date().setMonth(new Date().getMonth() + monthIndex)
    );

    this.monthSelected = this.displayedDate.getMonth();

    let startingDateOfCalendar = this.getStartDateForCalendar(
      new Date(this.displayedDate)
    );

    let dateToAdd = startingDateOfCalendar;
    for (let i = 0; i < 42; i++) {
      const day = new CalendarDay(new Date(dateToAdd));

      // Set clicked date to today at init
      if (day.isToday && !this.calendarDayInstance) {
        day.isClicked = true;
        this.calendarDayInstance = day;
      }
      if (
        this.calendarDayInstance &&
        this.calendarDayInstance.date.getTime() == day.date.getTime()
      ) {
        day.isClicked = true;
        this.calendarDayInstance = day;
      }

      // Check if day has events.
      for (let i = 0; i < this.calendarEvents.length; i++) {
        let element = this.calendarEvents[i];

        // Prepare 2 variables to check day with events
        let startDate = new Date();
        let endDate = new Date();

        startDate.setTime(element.startDate.getTime());
        endDate.setTime(element.endDate.getTime());
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        day.date.setHours(0, 0, 0, 0);
        day.date.setHours(0, 0, 0, 0);

        if (
          startDate.getTime() <= day.date.getTime() &&
          endDate.getTime() >= day.date.getTime()
        ) {
          day.hasEvent = true;
          day.events.push(this.calendarEvents[i]);
        }
      }

      dateToAdd = new Date(dateToAdd.setDate(dateToAdd.getDate() + 1));

      this.calendar.push(day);

      // // Reset Month selected
      // if (this.monthSelected > 11 || this.monthSelected < 0) {
      //   this.monthSelected = 0;
      // }
    }
  }

  getDaysOfMonth(month, year): number {
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
    if (month < 0) {
      month = 11;
      year--;
    }
    return new Date(year, month, 0).getDate();
  }

  private getStartDateForCalendar(selectedDate: Date) {
    // for the day we selected let's get the previous month last day
    let lastDayOfPreviousMonth = new Date(selectedDate.setDate(0));

    // start by setting the starting date of the calendar same as the last day of previous month
    let startingDateOfCalendar: Date = lastDayOfPreviousMonth;

    // but since we actually want to find the last Monday of previous month
    // we will start going back in days intil we encounter our last Monday of previous month
    if (startingDateOfCalendar.getDay() != 1) {
      do {
        startingDateOfCalendar = new Date(
          startingDateOfCalendar.setDate(startingDateOfCalendar.getDate() - 1)
        );
      } while (startingDateOfCalendar.getDay() != 1);
    }

    return startingDateOfCalendar;
  }

  public onDateClick(calendarDay) {
    //Reset old day clicked
    if (this.calendarDayInstance) {
      this.calendarDayInstance.isClicked = false;
    }
    this.calendarDayInstance = calendarDay;
    calendarDay.isClicked = true;
  }

  public addEvent() {
    this.calendarService.dayClicked = this.calendarDayInstance.date;
    this.router.navigate(['', 'app', 'calendar', 'event']);
  }

  public increaseMonth() {
    this.monthIndex++;
    this.monthSelected++;

    if (this.monthSelected > 11) {
      this.monthSelected = 0;
    }

    this.generateCalendarDays(this.monthIndex);
  }

  public decreaseMonth() {
    this.monthIndex--;
    this.monthSelected--;

    if (this.monthSelected < 0) {
      this.monthSelected = 11;
    }

    this.generateCalendarDays(this.monthIndex);
  }

  swipeRight() {
    if (this.swipingRight) {
      clearTimeout(this.swipingTimerRight);
    }
    this.swipingRight = true;
    this.swipingTimerRight = setTimeout(() => {
      this.swipingRight = false;
    }, 1500);

    this.decreaseMonth();
  }
  swipeLeft() {
    if (this.swipingLeft) {
      clearTimeout(this.swipingTimerLeft);
    }
    this.swipingLeft = true;
    this.swipingTimerLeft = setTimeout(() => {
      this.swipingLeft = false;
    }, 1500);

    this.increaseMonth();
  }

  public setCurrentMonth() {
    this.monthIndex = 0;
    this.monthSelected = new Date().getMonth();
    this.generateCalendarDays(this.monthIndex);
  }

  isSingleDayEvent(event: CalendarEvent): boolean {
    return new Date(event.startDate).setHours(0, 0, 0, 0) ===
      new Date(event.endDate).setHours(0, 0, 0, 0)
      ? true
      : false;
  }

  isEventLongerThan1Day(event: CalendarEvent) {
    return new Date(event.startDate).setHours(0, 0, 0, 0) !==
      new Date(event.endDate).setHours(0, 0, 0, 0)
      ? true
      : false;
  }

  isStartingDayOfEvent(event: CalendarEvent) {
    return new Date(this.calendarDayInstance.date).setHours(0, 0, 0, 0) ===
      new Date(event.startDate).setHours(0, 0, 0, 0)
      ? true
      : false;
  }

  isLastDayOfEvent(event: CalendarEvent) {
    return new Date(this.calendarDayInstance.date).setHours(0, 0, 0, 0) ===
      new Date(event.endDate).setHours(0, 0, 0, 0)
      ? true
      : false;
  }

  isFirstDayEvent(event: CalendarEvent): boolean {
    let isFirstDay = false;

    if (this.isEventLongerThan1Day(event) && this.isStartingDayOfEvent(event)) {
      isFirstDay = true;
    }
    return isFirstDay;
  }
  isLastDayEvent(event: CalendarEvent): boolean {
    let isLastDay = false;

    if (this.isEventLongerThan1Day(event) && this.isLastDayOfEvent(event)) {
      isLastDay = true;
    }
    return isLastDay;
  }
}
