import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FamilyService } from './../family.service';
import { Component, OnInit } from '@angular/core';
import { FamilyUser } from '../utils/family.models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-me',
  templateUrl: './edit-me.component.html',
  styleUrls: ['./edit-me.component.scss'],
})
export class EditMeComponent implements OnInit {
  isLoading = false;

  familyUser: FamilyUser;

  editFormGroup: FormGroup;
  photoFormGroup: FormGroup;

  constructor(
    private familyService: FamilyService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    if (!this.familyService.familyUser) {
      this.router.navigate(['', 'app', 'menu']);
    } else {
      this.familyUser = this.familyService.familyUser;
      this.editFormGroup = new FormGroup({});
      this.editFormGroup.addControl(
        'name',
        new FormControl(this.familyUser.name, [Validators.required])
      );
      this.editFormGroup.addControl(
        'dateOfBirth',
        new FormControl(this.familyUser.dateOfBirth, [Validators.required])
      );
      this.photoFormGroup = new FormGroup({});
      this.photoFormGroup.addControl('photo', new FormControl(''));

      this.isLoading = false;
    }
  }

  onImageUpload(file: File) {
    const formData = new FormData();
    formData.append('photo', file);
    this.familyService.changePhoto(formData).subscribe(
      (res) => {
        this.familyService.family = res.data.family;
        this.familyService.photoUpdate(this.familyService.family);
        this.familyUser = res.data.familyUser;
        this.familyUser.photo = `${this.familyUser.photo}?${Date.now()}`;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onUpdate() {
    this.isLoading = true;

    const updateInfo = {
      name: this.editFormGroup.controls.name.value,
      dateOfBirth: this.editFormGroup.controls.dateOfBirth.value,
    };

    this.familyService.updateMe(updateInfo).subscribe((res) => {
      this._snackBar.open('Your profile has been updated.', null, {
        duration: 3000,
        panelClass: ['snack-bar']
      });
      this.isLoading = false;
    });
  }
}
