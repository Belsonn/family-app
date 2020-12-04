import { Component, OnInit } from '@angular/core';
import baselineEvent from '@iconify-icons/ic/baseline-event';
import menuGridO from '@iconify-icons/gg/menu-grid-o';
import arrowLeftAlt2 from '@iconify-icons/dashicons/arrow-left-alt2';
import arrowRightAlt2 from '@iconify-icons/dashicons/arrow-right-alt2';
import plusLine from '@iconify-icons/clarity/plus-line';
import { CalendarDay } from '../utils/CalendarDay.class';
import { CalendarEvent } from '../utils/CalendarEvent.model';
import { MatDialog } from '@angular/material/dialog';
import { MonthNames } from '../utils/CalendarMonthNames';
import { CalendarService } from './calendar.service';
import { Router } from '@angular/router';
import { CalendarEventComponent } from './calendar-event/calendar-event.component';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  // Icons Block

  baselineEvent = baselineEvent;
  menuGridO = menuGridO;
  arrowRightAlt2 = arrowRightAlt2;
  arrowLeftAlt2 = arrowLeftAlt2;
  plusLine = plusLine;

  public calendar: CalendarDay[] = [];
  public monthNames = MonthNames;
  public displayDate: string;
  monthSelected: number;
  hover = "hover"
  standard = "standard"

  private monthIndex: number = 0;
  calendarDayInstance;
  calendarEvents: CalendarEvent[] = [];
  swipingRight = false;
  swipingLeft = false;
  swipingTimerRight;
  swipingTimerLeft;
  // TO DELETE LATER
  dummyEventStart: Date;
  dummyEventEnd: Date;
  element: CalendarEvent;
  element2: CalendarEvent;
  element3: CalendarEvent;
  // eventDayInstance;
  // eventDayLastMonthInstance;
  // timeInstance;
  monthlyEventInstance;

  constructor(
    public dialog: MatDialog,
    private calendarService: CalendarService,
    private router: Router,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit(): void {
    let testEvent = {
      title: 'TEST20',
      startDate: new Date(),
      endDate: new Date(),
      allDay: true,
      repeat: null,
    };
    testEvent.startDate.setDate(7);
    testEvent.endDate.setDate(13);
    this.element = {
      title: 'TEST1',
      startDate: new Date(),
      endDate: new Date(),
      allDay: true,
      repeat: {
        repeatType: 'Daily',
        repeatEvery: 10,
      },
      color:"#A34F41"
    };
    this.element2 = {
      title: 'Weekly TEST',
      startDate: new Date(),
      endDate: new Date(),
      allDay: true,
      repeat: {
        repeatType: 'Weekly',
        repeatEvery: 2,
      },
      color:"#A34F41"
    };
    this.element3 = {
      title: 'Monthly TEST',
      startDate: new Date(),
      endDate: new Date(),
      allDay: true,
      repeat: {
        repeatType: 'Monthly',
        repeatEvery: 3,
      },
      color:"#A34F41"
    };
    this.element.startDate.setDate(1);
    this.element.endDate.setDate(1);
    // this.calendarService.calendarEvents.push(this.element);
    this.calendarService.calendarEvents.push(this.element2);
    this.calendarService.calendarEvents.push(this.element3);
    // this.calendarService.calendarEvents.push(testEvent);
    // this.calendarService.calendarEvents.push(testEvent);
    this.calendarEvents = this.calendarService.calendarEvents;
    this.generateCalendarDays(this.monthIndex);
    this.monthSelected = new Date().getMonth();
  }

  onTest(){
    
  }

  isMobile(): boolean{
    return this.deviceService.isMobile();
  }

  private generateCalendarDays(monthIndex: number): void {
    // we reset our calendar
    this.calendar = [];

    // we set the date
    let day: Date = new Date(
      new Date().setMonth(new Date().getMonth() + monthIndex)
    );
    // set the dispaly date for UI
    this.displayDate = `${
      this.monthNames[day.getMonth()]
    } ${day.getFullYear()}`;
    this.monthSelected = day.getMonth();

    let startingDateOfCalendar = this.getStartDateForCalendar(day);

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

        // REPEAT BLOCK
        if (element.repeat) {
          let time;

          // Set time differnce between dates
          if(element.repeat.repeatType == 'Daily') {
            time = 86400000 * element.repeat.repeatEvery
          }
          else if(element.repeat.repeatType == 'Weekly') {
            time = 86400000 * 7 * element.repeat.repeatEvery
          } 

          //TODO
          else if(element.repeat.repeatType == "Monthly"){
            let startMonths = startDate.getFullYear() * 12 + startDate.getMonth();
            let dayMonths = day.date.getFullYear() * 12 + day.date.getMonth();
            if(day.date > startDate && day.date.getDate() == startDate.getDate() && (dayMonths - startMonths)%element.repeat.repeatEvery == 0){
              day.hasEvent = true;
              day.events.push(this.calendarEvents[i]);
            }
          }
          
          // Check if timezone is correctly set
          if(time && day.date.getTimezoneOffset() != startDate.getTimezoneOffset()) {
            let offset = (day.date.getTimezoneOffset() - startDate.getTimezoneOffset()) * 60 * 1000;
            startDate.setTime(startDate.getTime() + offset);
          }
          // Check event startDate and substraction between dates must be 0 mod time
          if(time && day.date > startDate && ((day.date.getTime() - startDate.getTime())%time == 0)){
            day.hasEvent = true;
            day.events.push(this.calendarEvents[i]);
          }
        }
      }
      this.calendar.push(day);
      dateToAdd = new Date(dateToAdd.setDate(dateToAdd.getDate() + 1));
    }

    // Reset Month selected
    if (this.monthSelected > 11 || this.monthSelected < 0) {
      this.monthSelected = 0;
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

  public eventLongerThan1Day(event: CalendarEvent) {
    if (
      event.startDate.getDate() !== event.endDate.getDate() &&
      event.endDate.getTime() - event.startDate.getTime() > 86400000
    ) {
      return true;
    } else {
      return false;
    }
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
}