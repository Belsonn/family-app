import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import emailLine from '@iconify/icons-clarity/email-line';
import lockPasswordLine from '@iconify/icons-ri/lock-password-line';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss', './../login-signup.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  emailLine = emailLine;
  lockPasswordLine = lockPasswordLine;

  isLoading = false;
  info = false;

  signupFormGroup: FormGroup;

  private authStatus: Subscription;

  
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.signupFormGroup = new FormGroup({});
    this.signupFormGroup.addControl(
      'email',
      new FormControl('', [
        Validators.compose([
          Validators.required,
          this.authService.getEmailValidator(),
        ]),
      ])
    );
    this.signupFormGroup.addControl(
      'password',
      new FormControl('', [Validators.required])
    );
    this.signupFormGroup.addControl(
      'passwordConfirm',
      new FormControl('', [
        Validators.compose([
          Validators.required,
          this.validateAreEqual.bind(this),
        ]),
      ])
    );
    console.log(this.signupFormGroup);
  }

  private validateAreEqual(fieldControl: FormControl) {
    return fieldControl.value === this.signupFormGroup.get('password').value
      ? null
      : {
          NotEqual: true,
        };
  }


  onSignup() {
    if (this.signupFormGroup.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService
      .signup(
        this.signupFormGroup.controls.email.value,
        this.signupFormGroup.controls.password.value,
        this.signupFormGroup.controls.passwordConfirm.value
      )
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.info = true;
        },
        (err) => {
          this.isLoading = false;
        }
      );
  }

  onNavigate(){
    this.router.navigate([''])
  }
  ngOnDestroy() {
    // this.authStatus.unsubscribe();
  }
}
