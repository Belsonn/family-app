import { ChatService } from './../chat/chat.service';
import { FamilyService } from './../family.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Component, ElementRef, OnInit, Query, ViewChild, AfterViewInit } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-app-container',
  templateUrl: './app-container.component.html',
  styleUrls: ['./app-container.component.scss'],
})
export class AppContainerComponent implements OnInit, AfterViewInit {
  isMobile: boolean;
  disableScroll: boolean

  @ViewChild(NgScrollbar, { static: true }) scrollable: NgScrollbar;
  @ViewChild('container') container: ElementRef;


  constructor(
    private deviceService: DeviceDetectorService,
    private familyService: FamilyService,
    private _location: Location,
    private chatService: ChatService
  ) {}


  ngOnInit(): void {
    this.isMobile = this.deviceService.isMobile();
    this.familyService.scrollSub.subscribe((el) => {
      setTimeout(() => {
        this.scrollable.scrollTo(el);
      }, 300);
    });
    this.familyService.scrollbarSub.subscribe((disable) => {
      this.disableScroll = disable;
    })
  }

  ngAfterViewInit(): void {
    this.scrollable.scrolled.subscribe(e=> {
      if(e.target.scrollTop == 0){
        this.chatService.loadMoreMessageSub.next(true);
      }
    });
  }

  onRouteBack() {
    this._location.back();
  }
}
