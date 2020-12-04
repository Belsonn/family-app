import { Component, OnInit } from '@angular/core';

import keyIcon from '@iconify-icons/bi/key';
import usergroupAddOutlined from '@iconify-icons/ant-design/usergroup-add-outlined';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FamilyJoinCreateService } from '../familyJoinCreate.service';
import { Router } from '@angular/router';

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

  inviteError: boolean = false;
  basicError: boolean = false;

  constructor(private familyJoinCreateService: FamilyJoinCreateService, private router: Router) {}

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
  }

  onTest() {
  }

  onJoin(){
    if(this.inviteFormGroup.invalid){
      return;
    }
    this.familyJoinCreateService.type = "join";
    this.familyJoinCreateService.inviteCode = this.inviteFormGroup.controls.inviteCode.value;
    this.familyJoinCreateService.checkCode().subscribe(res =>{
      if(res.data.exists){
        this.router.navigate(['', 'app', 'configureAccount']);
      } else {
        this.inviteError = true;
      }
    })

  }
  onCreate(){
    if(this.familyFormGroup.invalid){
      return;
    }
    this.familyJoinCreateService.type = "create";
    this.familyJoinCreateService.familyName = this.familyFormGroup.controls.familyName.value;
    this.router.navigate(['', 'app', 'configureAccount']);
  }
}
