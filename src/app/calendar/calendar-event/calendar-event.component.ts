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

  //LONG
  minEndDate: Date;

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
      startTimeControl: [null, Validators.required],
      endTimeControl: [null, Validators.required],
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
      this.calcEndDate();
    }
  }

  calcEndDate() {
    this.minEndDate = new Date();

    //Setting minEnd to 1 day after start
    this.minEndDate.setDate(this.longEventFormGroup.controls.startDateControl.value.getDate() + 1);

    // If startDate is after endDate -> change endDate
    if (this.longEventFormGroup.controls.endDateControl.value < this.minEndDate) {
      this.longEventFormGroup.patchValue({ endDateControl: this.minEndDate});
    }
  }

  // Disabling time if event is allDay
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

      // Set same date for start and end
      let startDate = new Date(
        this.shortEventFormGroup.controls.shortDateControl.value
      );
      let endDate = new Date(
        this.shortEventFormGroup.controls.shortDateControl.value
      );
      event.allDay = true;

      // If event is not allDay
      if(!this.shortEventFormGroup.controls.allDayControl.value) {
        event.allDay = false;

        //Start - hours and minutes
        const startTimeArray = this.shortEventFormGroup.controls.startTimeControl.value.split(
          ':'
        );
        startDate.setHours(parseInt(startTimeArray[0]));
        startDate.setMinutes(parseInt(startTimeArray[1]));
  
        // End - hours and minutes
        const endTimeArray = this.shortEventFormGroup.controls.endTimeControl.value.split(
          ':'
        );
        endDate.setHours(parseInt(endTimeArray[0]));
        endDate.setMinutes(parseInt(endTimeArray[1]));
      }
      
      // set event Date to modified date
      event.startDate = startDate;
      event.endDate = endDate;

    } else {
      event.startDate = this.longEventFormGroup.controls.startDateControl.value;
      event.endDate = this.longEventFormGroup.controls.endDateControl.value;
    }

    this.calendarService.calendarEvents.push(event);
    this.router.navigate(['/calendar']);
  }
}
