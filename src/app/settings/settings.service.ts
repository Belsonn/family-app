import { Settings, SettingsResponse } from './../utils/settings.models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {

  settings;
  isParent: boolean;

  constructor(private http: HttpClient) {}

  getSettings() {
    return this.http.get<SettingsResponse>(
      `${environment.apiURL}family/settings`
    );
  }
  updateSettings(settings: Settings) {
    return this.http.patch<SettingsResponse>(
      `${environment.apiURL}family/settings`,
      settings
    );
  }
}
