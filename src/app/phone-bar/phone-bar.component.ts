import { Component, OnInit } from '@angular/core';
import batteryFull from '@iconify/icons-bi/battery-full';
import signalIcon from '@iconify/icons-uil/signal';
import wifiIcon from '@iconify/icons-bi/wifi';

@Component({
  selector: 'app-phone-bar',
  templateUrl: './phone-bar.component.html',
  styleUrls: ['./phone-bar.component.scss']
})
export class PhoneBarComponent implements OnInit {
  public now: Date = new Date();

  batteryFull = batteryFull;
  wifiIcon = wifiIcon
  signalIcon = signalIcon;

  constructor() { 
    setInterval(() => {
      this.now = new Date();
    }, 5000);
  }

  ngOnInit(): void {
  }

}
