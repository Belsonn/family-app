import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { FamilyJoinCreateService } from '../familyJoinCreate.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-namecreator',
  templateUrl: './namecreator.component.html',
  styleUrls: ['./namecreator.component.scss'],
})
export class NamecreatorComponent implements OnInit {
  constructor(
    private familyJoinCreateService: FamilyJoinCreateService,
    private authService: AuthService,
    private router: Router
  ) {}

  isLoading = false;
  nameFormGroup: FormGroup;
  gender: string;

  today: Date;

  ngOnInit(): void {
    if (!this.familyJoinCreateService.type) {
      this.router.navigate(['', 'app', 'join']);
    }
    this.isLoading = true;
    this.today = new Date();
    this.initForm();
    this.isLoading = false;
  }

  initForm() {
    this.nameFormGroup = new FormGroup({});
    this.nameFormGroup.addControl(
      'name',
      new FormControl('', [Validators.required])
    );
    this.nameFormGroup.addControl(
      'gender',
      new FormControl('', [Validators.required])
    );
    this.nameFormGroup.addControl(
      'role',
      new FormControl('', [Validators.required])
    );
    this.nameFormGroup.addControl(
      'password',
      new FormControl('', [Validators.required])
    );
    this.nameFormGroup.addControl(
      'dateOfBirth',
      new FormControl('', [Validators.required])
    );
  }

  onCreateUser() {
    if (this.nameFormGroup.invalid) {
      return;
    }
    this.isLoading = true;
    this.familyJoinCreateService.userName = this.nameFormGroup.controls.name.value;
    this.familyJoinCreateService.gender = this.nameFormGroup.controls.gender.value;
    this.familyJoinCreateService.dateOfBirth = this.nameFormGroup.controls.dateOfBirth.value;
    this.familyJoinCreateService.role = this.nameFormGroup.controls.role.value;
    this.familyJoinCreateService.password = this.nameFormGroup.controls.password.value;

    if (this.familyJoinCreateService.type == 'create') {
      this.familyJoinCreateService.createFamily().subscribe((res) => {
        this.authService.onAuth(res);
        this.router.navigate(['']);
      });
    }
    if (this.familyJoinCreateService.type == 'join') {
      this.familyJoinCreateService.joinFamily().subscribe((res) => {
        this.authService.onAuth(res);
        this.router.navigate(['']);
      });
    }
  }
}
