import { SettingsService } from './../settings.service';
import { Settings } from './../../utils/settings.models';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-main',
  templateUrl: './settings-main.component.html',
  styleUrls: ['./settings-main.component.scss'],
})
export class SettingsMainComponent implements OnInit {
  isLoading = false;

  isParent: boolean


  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.getDataFromSettings();
  }

  getDataFromSettings() {
    this.isParent = this.settingsService.isParent;
  }

}
