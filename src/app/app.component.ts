import { Component, OnInit } from '@angular/core';
import { IconService } from '@visurel/iconify-angular';
import { AuthService } from './auth/auth.service';
import { appIcons } from './icons'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  title = 'Family Time';

  constructor(iconService: IconService, private authService: AuthService){
    iconService.registerAll(appIcons);
  }
  ngOnInit(): void {
    this.authService.autoAuth();
  }



}
