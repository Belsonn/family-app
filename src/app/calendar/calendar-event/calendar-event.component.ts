import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { MonthNames } from '../../utils/CalendarMonthNames';
import { pickerTheme } from '../../utils/TimePickerTheme';
import bxCalendarCheck from '@iconify-icons/bx/bx-calendar-check';
import bxCalendarX from '@iconify-icons/bx/bx-calendar-x';
import outlineAccessTime from '@iconify-icons/ic/outline-access-time';
import { CalendarEvent } from 'src/app/utils/CalendarEvent.model';
import { CalendarService } from '../calendar.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-calendar-event',
  templateUrl: './calendar-event.component.html',
  styleUrls: ['./calendar-event.component.scss']
})
export class CalendarEventComponent implements OnInit {

  bxCalendarCheck = bxCalendarCheck;
  bxCalendarX = bxCalendarX;
  outlineAccessTime = outlineAccessTime;
  longEvent: boolean = false;
  title: string = "";
  startTime: string;
  endTime: string;
  startDateShort: Date;
  startDate : Date;
  endDate: Date;
  minEndDate: Date
  monthNames = MonthNames;
  pickerTheme: NgxMaterialTimepickerTheme = pickerTheme;


  constructor(private _formBuilder: FormBuilder, private calendarService: CalendarService, private router: Router) {}

  ngOnInit() {
    if(this.calendarService.dayClicked){
      this.startDateShort = this.calendarService.dayClicked;
      this.startDate = this.calendarService.dayClicked;
      this.calcEndDate();
    }
  }
  

  calcEndDate(){
    const time = this.startDate.setDate(this.startDate.getDate() + 1);
    this.minEndDate = new Date(time);
    if(this.endDate < this.minEndDate){
      this.endDate = this.minEndDate;
    }
  }


  onTest(){
    console.log(this.startDateShort);
  }
  addEvent() {
    let event: CalendarEvent = {title: "", startDate: new Date(), endDate: new Date(), allDay: false};
    event.title = this.title;
    if(!this.longEvent){
      let startDate = new Date(this.startDateShort);
      let endDate = new Date(this.startDateShort);

      const startTimeArray = this.startTime.split(":");
      startDate.setHours(parseInt(startTimeArray[0]));
      startDate.setMinutes(parseInt(startTimeArray[1]));
      
      const endTimeArray = this.endTime.split(":");
      endDate.setHours(parseInt(endTimeArray[0]));
      endDate.setMinutes(parseInt(endTimeArray[1]));

      event.startDate = startDate;
      event.endDate = endDate;
      event.allDay = false;
    }
    else {
      event.startDate = this.startDate;
      event.endDate = this.endDate;
    }

    this.calendarService.calendarEvents.push(event);
    this.router.navigate(['/calendar'])
  }
}
