import { FamilyService } from './../family.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-app-container',
  templateUrl: './app-container.component.html',
  styleUrls: ['./app-container.component.scss'],
})
export class AppContainerComponent implements OnInit {
  isMobile: boolean;

  @ViewChild(NgScrollbar, { static: true }) scrollable: NgScrollbar;

  constructor(
    private deviceService: DeviceDetectorService,
    private familyService: FamilyService,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.isMobile = this.deviceService.isMobile();
    this.familyService.scrollSub.subscribe((el) => {
      setTimeout(() => {
        this.scrollable.scrollTo(el);
      }, 300);
    });
  }

  onRouteBack() {
    this._location.back();
  }
}
