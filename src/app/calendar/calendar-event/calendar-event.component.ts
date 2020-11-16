import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  styleUrls: ['./calendar-event.component.scss'],
})
export class CalendarEventComponent implements OnInit {
  bxCalendarCheck = bxCalendarCheck;
  bxCalendarX = bxCalendarX;
  outlineAccessTime = outlineAccessTime;

  longEvent: boolean = false;

  //SHORT
  allDay: boolean = false;

  //FormControls
  titleFormGroup: FormGroup;
  shortEventFormGroup: FormGroup;
  longEventFormGroup: FormGroup;

  monthNames = MonthNames;
  pickerTheme: NgxMaterialTimepickerTheme = pickerTheme;

  constructor(
    private _formBuilder: FormBuilder,
    private calendarService: CalendarService,
    private router: Router
  ) {}

  ngOnInit() {
    this.titleFormGroup = this._formBuilder.group({
      titleControl: ['', Validators.required],
    });
    this.shortEventFormGroup = this._formBuilder.group({
      allDayControl: [''],
      shortDateControl: ['', Validators.required],
      startTimeControl: ['', Validators.required],
      endTimeControl: ['', Validators.required],
    });
    this.longEventFormGroup = this._formBuilder.group({
      startDateControl: ['', Validators.required],
      endDateControl: ['', Validators.required],
    });
    if (this.calendarService.dayClicked) {
      this.shortEventFormGroup.patchValue({
        shortDateControl: this.calendarService.dayClicked,
      });
      this.longEventFormGroup.patchValue({
        startDateControl: this.calendarService.dayClicked,
      });
      // this.calcEndDate();
    }
  }

  calcEndDate() {
    // const time = this.startDate.setDate(this.startDate.getDate() + 1);
    // this.minEndDate = new Date(time);
    // if (this.endDate < this.minEndDate) {
    //   this.endDate = this.minEndDate;
    // }
  }
  allDayChange(event) {
    if (event.checked) {
      this.shortEventFormGroup.get('startTimeControl').disable();
      this.shortEventFormGroup.get('endTimeControl').disable();
    } else {
      this.shortEventFormGroup.get('startTimeControl').enable();
      this.shortEventFormGroup.get('endTimeControl').enable();
    }
  }

  onTest() {
    console.log(
      this.calendarService.dayClicked,
      this.shortEventFormGroup,
      this.longEventFormGroup
    );
  }
  addEvent() {
    let event: CalendarEvent = {
      title: '',
      startDate: new Date(),
      endDate: new Date(),
      allDay: false,
    };
    event.title = this.titleFormGroup.controls.titleControl.value;
    if (!this.longEvent) {
      let startDate = new Date(
        this.shortEventFormGroup.controls.shortDateControl.value
      );
      let endDate = new Date(
        this.shortEventFormGroup.controls.shortDateControl.value
      );

      const startTimeArray = this.shortEventFormGroup.controls.startTimeControl.value.split(
        ':'
      );
      startDate.setHours(parseInt(startTimeArray[0]));
      startDate.setMinutes(parseInt(startTimeArray[1]));

      const endTimeArray = this.shortEventFormGroup.controls.endTimeControl.value.split(
        ':'
      );
      endDate.setHours(parseInt(endTimeArray[0]));
      endDate.setMinutes(parseInt(endTimeArray[1]));

      event.startDate = startDate;
      event.endDate = endDate;
      event.allDay = this.shortEventFormGroup.controls.allDayControl.value;
    } else {
      event.startDate = this.longEventFormGroup.controls.startDateControl.value;
      event.endDate = this.longEventFormGroup.controls.endDateControl.value;
    }

    this.calendarService.calendarEvents.push(event);
    this.router.navigate(['/calendar']);
  }
}
