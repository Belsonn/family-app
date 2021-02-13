import { FamilyService } from './../family.service';
import { FamilyUser } from './../utils/family.models';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  isLoading = false;

  user: FamilyUser;

  today : Date;

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.today = new Date();
  }

  onLogout() {
    this.authService.logout();
  }
}
