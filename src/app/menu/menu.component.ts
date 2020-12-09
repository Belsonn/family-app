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

  constructor(
    private authService: AuthService,
    private familyService: FamilyService,
    private router: Router
  ) {}
  onTest() {
    console.log('elo');
  }
  ngOnInit(): void {
    this.isLoading = true;

    // No auth data 
    if (!this.familyService.familyId || !this.familyService.familyUserId) {
      this.router.navigate(['']);
    }
    // Check if data has been loaded
    if (this.familyService.family && this.familyService.familyUser) {
      this.user = this.familyService.familyUser;
      this.isLoading = false;
    }
    // Load Data
    else if (this.familyService.familyId && this.familyService.familyUserId) {
      this.familyService
        .getMeAndFamily(
          this.familyService.familyId,
          this.familyService.familyUserId
        )
        .subscribe((res) => {
          this.user = res.data.familyUser;
          this.familyService.family = res.data.family;
          this.familyService.familyUser = res.data.familyUser;
          this.isLoading = false;
        });
    }
  }

  onLogout() {
    this.authService.logout();
  }
}
