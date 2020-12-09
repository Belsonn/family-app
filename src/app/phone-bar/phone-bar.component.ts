import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-phone-bar',
  templateUrl: './phone-bar.component.html',
  styleUrls: ['./phone-bar.component.scss']
})
export class PhoneBarComponent implements OnInit {
  public now: Date = new Date();
  constructor() { 
    setInterval(() => {
      this.now = new Date();
    }, 5000);
  }

  ngOnInit(): void {
  }

}
