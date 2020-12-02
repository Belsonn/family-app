import { Component, OnInit } from '@angular/core';

import keyIcon from '@iconify-icons/bi/key';
import usergroupAddOutlined from '@iconify-icons/ant-design/usergroup-add-outlined';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-nofamily',
  templateUrl: './nofamily.component.html',
  styleUrls: ['./nofamily.component.scss'],
})
export class NofamilyComponent implements OnInit {
  keyIcon = keyIcon;
  usergroupAddOutlined = usergroupAddOutlined;

  inviteFormGroup: FormGroup;
  familyFormGroup: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.inviteFormGroup = new FormGroup({});
    this.familyFormGroup = new FormGroup({});

    this.inviteFormGroup.addControl(
      'inviteCode',
      new FormControl('', [Validators.required])
    );
    this.familyFormGroup.addControl(
      'familyName',
      new FormControl('', [Validators.required])
    );
    console.log(this.familyFormGroup);
  }

  onTest() {
    console.log(this.familyFormGroup);
  }
}
