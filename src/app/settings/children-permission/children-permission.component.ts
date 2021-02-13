import { Component, OnInit } from '@angular/core';import { Settings } from 'src/app/utils/settings.models';
;
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-children-permission',
  templateUrl: './children-permission.component.html',
  styleUrls: ['./children-permission.component.scss']
})
export class ChildrenPermissionComponent implements OnInit {
  isLoading = false;
  settings: Settings;

  showCalendarSettings: boolean = true;
  showShoppingListSettings: boolean = true;

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.settings = this.settingsService.settings;
  }


  editSettings() {
    this.isLoading = true;
    this.settingsService.updateSettings(this.settings).subscribe((res) => {
      this.isLoading = false;
    });
  }

}
