import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FamilyService } from './../family.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FamilyUser } from '../utils/family.models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Icon } from '../utils/files.models';

@Component({
  selector: 'app-edit-me',
  templateUrl: './edit-me.component.html',
  styleUrls: ['./edit-me.component.scss'],
})
export class EditMeComponent implements OnInit {
  isLoading = false;

  familyUser: FamilyUser;

  icons: Icon[];

  editFormGroup: FormGroup;
  photoFormGroup: FormGroup;

  constructor(
    private familyService: FamilyService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.getMe();
  }

  getMe(){
    this.familyService.getMe().subscribe(res => {
      this.familyUser = res.data.familyUser;
      this.initFormGroup();
      this.getIcons();
    })
  }

  initFormGroup() {
      this.editFormGroup = this._formBuilder.group({
        name: [this.familyUser.name, Validators.required],
        dateOfBirth: [this.familyUser.dateOfBirth, Validators.required],
      });
      this.photoFormGroup = new FormGroup({});
      this.photoFormGroup.addControl('photo', new FormControl(''));
  }

  getIcons() {
    this.familyService.getIcons().subscribe((res) => {
      this.icons = res.data.icons;
      this.isLoading = false;
    });
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
      photo: this.familyUser.photo,
    };

    this.familyService.updateMe(updateInfo).subscribe((res) => {
      this.familyService.photoUpdate(this.familyService.family);
      this.cdRef.detectChanges();
      this._snackBar.open('Your profile has been updated.', null, {
        duration: 3000,
        panelClass: ['snack-bar'],
      });
      this.isLoading = false;
    });
  }

  onIconSet(icon: Icon) {
    this.familyUser.photo = icon.file;
  }
}
