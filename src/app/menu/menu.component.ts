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
    // this.isLoading = true;
    // this.familyService.getMeAndFamily().subscribe((res) => {
    //   this.familyService.family = res.data.family;
    //   this.familyService.familyUser = res.data.familyUser;
    //   this.user = this.familyService.familyUser;
    //   this.isLoading = false;
    // });

  }

  onLogout() {
    this.authService.logout();
  }
}
