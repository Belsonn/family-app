import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rewards-main',
  templateUrl: './rewards-main.component.html',
  styleUrls: ['./rewards-main.component.scss']
})
export class RewardsMainComponent implements OnInit {
  isLoading : boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
