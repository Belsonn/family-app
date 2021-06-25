import {
  Component,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-app-container',
  templateUrl: './app-container.component.html',
  styleUrls: ['./app-container.component.scss'],
})
export class AppContainerComponent implements OnInit {
  // isMobile: boolean;
  // disableScroll: boolean

  // @ViewChild(NgScrollbar, { static: true }) scrollable: NgScrollbar;
  // @ViewChild('container') container: ElementRef;

  // constructor(
  //   private deviceService: DeviceDetectorService,
  //   private familyService: FamilyService,
  //   private _location: Location,
  //   private chatService: ChatService
  // ) {}

  // ngOnInit(): void {
  //   this.isMobile = this.deviceService.isMobile();
  //   this.familyService.scrollSub.subscribe((el) => {
  //     setTimeout(() => {
  //       this.scrollable.scrollTo(el);
  //     }, 300);
  //   });
  //   this.familyService.scrollbarSub.subscribe((disable) => {
  //     this.disableScroll = disable;
  //   })
  // }

  // ngAfterViewInit(): void {
  //   this.scrollable.scrolled.subscribe(e=> {
  //     if(e.target.scrollTop == 0){
  //       this.chatService.loadMoreMessageSub.next(true);
  //     }
  //   });
  // }

  // onRouteBack() {
  //   this._location.back();
  // }
  isExpanded = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
  }

  onLogout() {
    this.authService.logout();
  }
}
