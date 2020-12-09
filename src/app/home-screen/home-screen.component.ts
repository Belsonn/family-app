import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss'],
})
export class HomeScreenComponent implements OnInit {
  isAuthenticated = false;
  isLocalAuthenticated = false;
  isLoading = false;
  private authStatus: Subscription;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.getIsAuthenticated();
    this.isLocalAuthenticated = this.authService.getIsLocalAuthenticated();
    this.authStatus = this.authService
      .getAuthStatus()
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
        if (this.isAuthenticated) {
          this.router.navigate(['', 'app', 'menu']);
        }
      });
    if (this.isAuthenticated) {
      this.router.navigate(['', 'app', 'menu']);
    }
  }
}
