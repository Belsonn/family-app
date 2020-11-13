import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { MonthNames } from '../../utils/CalendarMonthNames';
import { pickerTheme } from '../../utils/TimePickerTheme';

@Component({
  selector: 'app-calendar-event',
  templateUrl: './calendar-event.component.html',
  styleUrls: ['./calendar-event.component.scss']
})
export class CalendarEventComponent implements OnInit {


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

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {}
  

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
  onTest1(stepper){
    console.log("stepper  ", stepper);
  }
}
