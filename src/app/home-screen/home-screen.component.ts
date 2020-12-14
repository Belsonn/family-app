import { AfterViewInit, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss'],
})
export class HomeScreenComponent implements OnInit, AfterViewInit, OnDestroy {
  isAuthenticated = false;
  isLoading = true;
  private authStatus: Subscription;
  constructor(private authService: AuthService, private router: Router, private ref: ChangeDetectorRef) {}


  ngOnInit(): void {
    this.isLoading = true;
    this.authStatus = this.authService
    .getAuthStatus()
    .subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
      this.isLoading = false;
      if (this.isAuthenticated) {
        this.router.navigate(['', 'app', 'menu']);
      }
    });
    this.authService.autoAuth();
    this.isAuthenticated = this.authService.getIsAuthenticated();
    if (this.isAuthenticated) {
      this.router.navigate(['', 'app', 'menu']);
    }
  }
  ngAfterViewInit() {
    // this.isLoading = false;
    // this.ref.detectChanges();
  }

  ngOnDestroy(): void {
    this.authStatus.unsubscribe();
  }
}
