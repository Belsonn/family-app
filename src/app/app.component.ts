import { Component } from '@angular/core';
// import { faComments, faShoppingBasket, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { IconService } from '@visurel/iconify-angular';
import { appIcons } from './icons'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'family-app';
  // faComments = faComments;
  // faCalendarAlt = faCalendarAlt;
  // faShoppingBasket = faShoppingBasket;

  constructor(iconService: IconService){
    iconService.registerAll(appIcons);
  }

}
