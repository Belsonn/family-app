import { FamilyService } from './../family.service';
import { Component, OnInit } from '@angular/core';
import { Grocery } from '../utils/family.models';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {

  isLoading = false;

  groceries: [Grocery]

  constructor(private familyService: FamilyService) { }

  ngOnInit(): void {
    this.groceries = this.familyService.family.groceries;
  }

  onTest(){
    console.log(this.groceries)
  }
}
