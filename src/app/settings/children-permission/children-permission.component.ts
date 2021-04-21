import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Settings } from 'src/app/utils/settings.models';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-children-permission',
  templateUrl: './children-permission.component.html',
  styleUrls: ['./children-permission.component.scss'],
})
export class ChildrenPermissionComponent implements OnInit {
  isLoading = false;
  settings: Settings;

  showCalendarSettings: boolean = true;
  showShoppingListSettings: boolean = true;

  constructor(
    private settingsService: SettingsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.authService.getMe().subscribe((res) => {
      if (res.data.user.role == 'child')
        this.router.navigate(['', 'app', 'settings']);
    });
    this.settings = this.settingsService.settings;
    this.isLoading = false;
  }

  editSettings() {
    this.isLoading = true;
    this.settingsService.updateSettings(this.settings).subscribe((res) => {
      this.isLoading = false;
    });
  }
}
