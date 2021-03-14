import { FamilyService } from './../../family.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { pickerTheme } from '../../utils/TimePickerTheme';
import { CalendarEvent } from 'src/app/utils/CalendarEvent.model';
import { CalendarService } from '../calendar.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-calendar-event',
  templateUrl: './calendar-event.component.html',
  styleUrls: ['./calendar-event.component.scss'],
})
export class CalendarEventComponent implements OnInit {
  isLoading = false;

  today = new Date();
  editMode: boolean = false;
  minEndDate: Date;

  eventToUpdate: string;

  //FormControls
  calendarEventFormGroup: FormGroup;

  pickerTheme: NgxMaterialTimepickerTheme = pickerTheme;

  constructor(
    private _formBuilder: FormBuilder,
    private calendarService: CalendarService,
    private familyService: FamilyService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.initAllFormGroups();
    this.checkStartDate();
    this.checkQueryParams();
  }

  initAllFormGroups() {
    this.calendarEventFormGroup = this._formBuilder.group({
      name: ['', Validators.required],
      allDay: [false],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
    });
  }

  checkQueryParams() {
    this.route.queryParams.subscribe((param) => {
      if (param.id) {
        this.isLoading = true;
        this.calendarService.getEvent(param.id).subscribe(
          (res) => {
            this.editMode = true;
            this.eventToUpdate = param.id;
            this.fillEventData(res.data.event);
            this.isLoading = false;
          },
          (err) => {
            this.router.navigate(['', 'app', 'calendar']);
          }
        );
      } else {
        this.isLoading = false;
      }
    });
  }

  fillEventData(event: CalendarEvent) {
    this.calendarEventFormGroup.get('name').setValue(event.name);

    this.calendarEventFormGroup.get('startDate').setValue(event.startDate);
    this.calendarEventFormGroup.get('endDate').setValue(event.endDate);

    event.startDate = new Date(event.startDate);
    event.endDate = new Date(event.endDate);

    let startTime = `${this.formatDate(
      event.startDate.getHours()
    )}:${this.formatDate(event.startDate.getMinutes())}`;

    let endTime = `${this.formatDate(
      event.endDate.getHours()
    )}:${this.formatDate(event.endDate.getMinutes())}`;

    this.calendarEventFormGroup.get('startTime').setValue(startTime);
    this.calendarEventFormGroup.get('endTime').setValue(endTime);
  }

  formatDate(number: number) {
    return number < 10 ? `0${number}` : `${number}`;
  }

  checkStartDate() {
    if (
      this.calendarService.dayClicked
    ) {
      this.calendarEventFormGroup
        .get('startDate')
        .setValue(this.calendarService.dayClicked);
      this.calcEndDate();
    }
  }

  calcEndDate() {
    this.minEndDate = new Date();

    //Setting minEnd to same day
    this.minEndDate.setDate(
      this.calendarEventFormGroup.controls.startDate.value.getDate()
    );

    // If startDate is after endDate -> change endDate
    if (this.calendarEventFormGroup.controls.endDate.value < this.minEndDate) {
      this.calendarEventFormGroup.patchValue({ endDate: this.minEndDate });
    }
  }

  // Disabling time if event is allDay
  allDayChange(event) {
    if (event.checked) {
      this.calendarEventFormGroup.get('startTime').disable();
      this.calendarEventFormGroup.get('endTime').disable();
    } else {
      this.calendarEventFormGroup.get('startTime').enable();
      this.calendarEventFormGroup.get('endTime').enable();
    }
  }

  checkModeAndSubmit() {
    if (this.calendarEventFormGroup.controls.name.invalid) {
      this.familyService.scrollSub.next({ top: 0, duration: 1000 });
      return;
    } else if (this.calendarEventFormGroup.invalid) {
      return;
    } else if (this.editMode) {
      this.editEvent();
    } else {
      this.addEvent();
    }
  }

  getEventFromForm(): CalendarEvent {
    let event: CalendarEvent = {
      name: this.calendarEventFormGroup.controls.name.value,
      startDate: new Date(this.calendarEventFormGroup.controls.startDate.value),
      endDate: new Date(this.calendarEventFormGroup.controls.endDate.value),
    };

    if (this.calendarEventFormGroup.controls.allDay.value) {
      event.startDate.setHours(0, 0, 0, 0);
      event.endDate.setHours(23, 59, 59, 99);
    } else {
      let startTime = this.calendarEventFormGroup.controls.startTime.value.split(
        ':'
      );
      let endTime = this.calendarEventFormGroup.controls.endTime.value.split(
        ':'
      );

      event.startDate.setHours(parseInt(startTime[0]), parseInt(startTime[1]));
      event.endDate.setHours(parseInt(endTime[0]), parseInt(endTime[1]));
    }

    return event;
  }

  addEvent() {
    this.isLoading = true;

    let event = this.getEventFromForm();

    this.calendarService.addEvent(event).subscribe((res) => {
      this.router.navigate(['', 'app', 'calendar']);
    });
  }
  editEvent() {
    this.isLoading = true;

    let event = this.getEventFromForm();

    this.calendarService.updateEvent(this.eventToUpdate, event).subscribe((res) => {
      this.router.navigate(['', 'app', 'calendar']);
    });
  }
}
