import { FamilyService } from './../../family.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { MonthNames } from '../../utils/CalendarMonthNames';
import { pickerTheme } from '../../utils/TimePickerTheme';
import { CalendarEvent } from 'src/app/utils/CalendarEvent.model';
import { CalendarService } from '../calendar.service';
import { Router } from '@angular/router';
import { FamilyUser } from 'src/app/utils/family.models';
@Component({
  selector: 'app-calendar-event',
  templateUrl: './calendar-event.component.html',
  styleUrls: ['./calendar-event.component.scss'],
})
export class CalendarEventComponent implements OnInit {
  true = true;
  apply = $localize`Apply`;
  isLoading = false;

  longEvent: boolean = false;
  color: String;

  //SHORT
  allDay: boolean = false;

  //LONG
  minEndDate: Date;

  //FormControls
  titleFormGroup: FormGroup;
  radioFormGroup: FormGroup;
  shortEventFormGroup: FormGroup;
  longEventFormGroup: FormGroup;
  repeatFormGroup: FormGroup;

  familyUsers: { user: FamilyUser; isSelected: Boolean }[] = [];

  monthNames = MonthNames;
  repeatTypes = [$localize`Daily`, $localize`Weekly`, $localize`Monthly`];
  repeatDaily = [];
  repeatWeekly = [];
  repeatMonthly = [];

  pickerTheme: NgxMaterialTimepickerTheme = pickerTheme;

  constructor(
    private _formBuilder: FormBuilder,
    private calendarService: CalendarService,
    private familyService: FamilyService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = true;
    if (!this.familyService.family) {
      this.router.navigate(['', 'app', 'menu']);
    } else {
      this.initAllFormGroups();
      this.fillRepeatArrays();
      this.onRepeatChange();

      if (this.calendarService.dayClicked) {
        this.shortEventFormGroup.patchValue({
          shortDateControl: this.calendarService.dayClicked,
        });
        this.longEventFormGroup.patchValue({
          startDateControl: this.calendarService.dayClicked,
        });
        this.calcEndDate();
      }

      this.familyService.family.users.map((user) => {
        this.familyUsers.push({
          user: user,
          isSelected: false,
        });
      });

      console.log(this.familyUsers);
      this.color = '#9851b4';
      this.isLoading = false;
    }
  }

  initAllFormGroups() {
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
    this.repeatFormGroup = this._formBuilder.group({
      repeatToggleControl: '',
      repeatTypeControl: [
        { value: 'Daily', disabled: true },
        Validators.required,
      ],
      repeatEveryControl: [{ value: '', disabled: true }, Validators.required],
    });
    this.radioFormGroup = this._formBuilder.group({
      longEvent: ['', Validators.required],
    });
  }

  onSelectUser(familyUser) {
    familyUser.isSelected = !familyUser.isSelected;
  }
  onSelectAll() {
    let allSelected = true;
    this.familyUsers.forEach((el) => {
      if (!el.isSelected) {
        allSelected = false;
      }
    });
    if (allSelected) {
      this.familyUsers = this.familyUsers.map((el) => {
        return {
          user: el.user,
          isSelected: !el.isSelected,
        };
      });
    } else {
      this.familyUsers = this.familyUsers.map((el) => {
        return {
          user: el.user,
          isSelected: true,
        };
      });
    }
  }

  onRepeatChange() {
    this.radioFormGroup.get('longEvent').valueChanges.subscribe((value) => {
      if (value) {
        this.repeatFormGroup.get('repeatToggleControl').disable();
      } else {
        this.repeatFormGroup.get('repeatToggleControl').enable();
      }
    });
  }

  calcEndDate() {
    this.minEndDate = new Date();

    //Setting minEnd to 1 day after start
    this.minEndDate.setDate(
      this.longEventFormGroup.controls.startDateControl.value.getDate() + 1
    );

    // If startDate is after endDate -> change endDate
    if (
      this.longEventFormGroup.controls.endDateControl.value < this.minEndDate
    ) {
      this.longEventFormGroup.patchValue({ endDateControl: this.minEndDate });
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

  fillRepeatArrays() {
    for (let i = 1; i <= 12; i++) {
      if (i <= 4) {
        this.repeatDaily.push(i);
        this.repeatWeekly.push(i);
        this.repeatMonthly.push(i);
      } else if (i <= 7) {
        this.repeatDaily.push(i);
        this.repeatMonthly.push(i);
      } else {
        this.repeatMonthly.push(i);
      }
    }
  }

  repeatToggle(event) {
    if (event.checked) {
      this.repeatFormGroup.get('repeatTypeControl').enable();
      this.repeatFormGroup.get('repeatEveryControl').enable();
    } else {
      this.repeatFormGroup.get('repeatTypeControl').disable();
      this.repeatFormGroup.get('repeatEveryControl').disable();
    }
  }

  onTest() {
    console.log(this.repeatFormGroup);
    console.log(this.color);
  }

  addEvent() {
    let event: CalendarEvent = {
      name: '',
      startDate: new Date(),
      endDate: new Date(),
      allDay: false,
      repeat: null,
      color: this.color,
    };

    event.name = this.titleFormGroup.controls.titleControl.value;

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
      if (!this.shortEventFormGroup.controls.allDayControl.value) {
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

    if (this.repeatFormGroup.controls.repeatToggleControl.value) {
      event.repeat = {
        repeatType: this.repeatFormGroup.controls.repeatTypeControl.value,
        repeatEvery: this.repeatFormGroup.controls.repeatEveryControl.value,
      };
    }

    this.calendarService
      .addEvent(this.familyService.familyId, event)
      .subscribe((res) => {
        this.router.navigate(['', 'app', 'calendar']);
      });
  }
}
