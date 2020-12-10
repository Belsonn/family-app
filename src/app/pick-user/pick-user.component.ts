import { AuthService } from './../auth/auth.service';
import { Router } from '@angular/router';
import { FamilyJoinCreateService } from './../familyJoinCreate.service';
import { FamilyService } from './../family.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit} from '@angular/core';
import { FamilyUser } from '../utils/family.models';

@Component({
  selector: 'app-pick-user',
  templateUrl: './pick-user.component.html',
  styleUrls: ['./pick-user.component.scss'],
})
export class PickUserComponent implements OnInit {
  isLoading = false;
  error = false;
  users: [FamilyUser];
  selectedUser: FamilyUser;
  isMobile: boolean;

  loggingFormGroup: FormGroup;


  constructor(
    private authService: AuthService,
    private familyService: FamilyService,
    private familyJoinCreateService: FamilyJoinCreateService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loggingFormGroup = new FormGroup({});
    this.loggingFormGroup.addControl(
      'password',
      new FormControl('', [Validators.required])
    );
    if (!this.familyService.familyId) {
      this.router.navigate(['', 'app', 'join']);
    } else {
      this.familyService
        .getFamily(this.familyService.familyId)
        .subscribe((res) => {
          this.familyJoinCreateService.familyid = res.data.family._id;
          this.users = res.data.family.users;
          this.isLoading = false;
        });
    }
  }
  onSelectedUser(user) {
    this.selectedUser = user;
    this.familyService.scrollSub.next({bottom: 0, duration: 1000})
  }
  resetUser() {
    this.selectedUser = null;
  }

  onLogin() {
    if (this.loggingFormGroup.invalid) {
      return;
    }
    this.familyJoinCreateService
      .loginToFamily(
        this.selectedUser._id,
        this.loggingFormGroup.controls.password.value
      )
      .subscribe(
        (res) => {
          this.authService.onAuth(res);
        },
        (err) => {
          this.error = true;
        }
      );
  }
}
