import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import emailLine from '@iconify/icons-clarity/email-line';
import lockPasswordLine from '@iconify/icons-ri/lock-password-line';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', './../login-signup.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  emailLine = emailLine;
  lockPasswordLine = lockPasswordLine;

  isLoading = false;
  info: boolean = false;

  loginFormGroup: FormGroup;
  
  private authStatus: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginFormGroup = new FormGroup({});
    this.loginFormGroup.addControl(
      'email',
      new FormControl('', [
        Validators.compose([
          Validators.required,
          this.authService.getEmailValidator(),
        ]),
      ])
    );
    this.loginFormGroup.addControl(
      'password',
      new FormControl('', [Validators.required])
    );
  }

  onLogin() {
    if(this.loginFormGroup.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.login(this.loginFormGroup.controls.email.value, this.loginFormGroup.controls.password.value).subscribe(res=>{
      this.authService.onAuth(res);
      this.isLoading = false;
      this.router.navigate(['menu']);
    }, err => {
      this.isLoading = false;
    })
  }

  onNavigate(){
    this.router.navigate([''])
  }
  onTest(){
    console.log(this.authService.getToken());
  }

  ngOnDestroy() {
    // this.authStatus.unsubscribe();
  }
}
