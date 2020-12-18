import { FamilyService } from './../family.service';
  
import {  Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private familyService: FamilyService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authService.getIsAuthenticated();
    if (!isAuth) {
      this.router.navigate(['/']);
      if(!this.authService.savedRoute){
        this.authService.savedRoute = route.routeConfig.path.split("/");
        this.authService.savedParams = route.queryParams;
      }
    } else {
      if(this.authService.savedRoute){
        this.router.navigate(['', 'app', ...this.authService.savedRoute], {queryParams: this.authService.savedParams})
        this.authService.savedRoute = null;
      }
    }
    return isAuth;
  }
}