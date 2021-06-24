import { Router } from '@angular/router';
import { FamilyService } from './../family.service';
import { Family } from './../utils/family.models';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.scss'],
})
export class FamilyComponent implements OnInit {
  isLoading = false;

  family: Family;

  constructor(private familyService: FamilyService, private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.getFamily();
  }

  getFamily() {
    this.familyService.getMyFamily().subscribe((res) => {
      this.family = res.data.family;
      this.isLoading = false;
    });
  }
  onEdit() {
    this.router.navigate(['', 'app', 'updateAccount']);
  }
}
