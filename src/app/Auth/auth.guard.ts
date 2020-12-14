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
      if(!this.familyService.savedRoute){
        this.familyService.savedRoute = route.routeConfig.path.split("/");
      }
    } else {
      if(this.familyService.savedRoute){
        this.router.navigate(['', 'app', ...this.familyService.savedRoute])
        this.familyService.savedRoute = null;
      }
    }
    return isAuth;
  }
}