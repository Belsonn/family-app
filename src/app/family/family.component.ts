import { Router } from '@angular/router';
import { FamilyService } from './../family.service';
import { Family } from './../utils/family.models';
import { Component, OnInit } from '@angular/core';
import arrowBackUp from '@iconify/icons-tabler/arrow-back-up';
import userEdit from '@iconify-icons/fa-solid/user-edit';

@Component({
  selector: 'app-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.scss']
})
export class FamilyComponent implements OnInit {

  arrowBackUp = arrowBackUp;
  userEdit = userEdit;

  isLoading = false;
  loggedUserId;

  family: Family

  constructor(private familyService : FamilyService, private router : Router) { }

  ngOnInit(): void {
    this.isLoading = true;

    if(!this.familyService.familyId){
      this.router.navigate(['','app', 'menu'])
    } else {
      this.loggedUserId = this.familyService.familyUserId;
      this.family = this.familyService.family;
      this.isLoading = false;
    }
  }

  onTest(){
    console.log("XD");
  }
  onEdit(){
    this.router.navigate(['', 'app', 'updateAccount'])
  }



}
