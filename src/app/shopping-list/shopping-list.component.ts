import { ShoppingService } from './shopping.service';
import { FamilyService } from './../family.service';
import { Component, OnInit } from '@angular/core';
import { Grocery } from '../utils/family.models';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 })),
      ]),
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
      transition(':leave', [
        // :leave is alias to '* => void'
        animate(500, style({ opacity: 0 })),
      ]),
    ]),
    trigger('moveOutIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(0%)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('500ms', style({ transform: 'translateX(-100%)', opacity: 0 })),
      ]),
    ]),
    trigger('moveUpDown', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(0%)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(-100%)', opacity: 1 }),
      ]),
    ]),
  ],
})
export class ShoppingListComponent implements OnInit {
  isLoading = false;
  clicked: number;

  groceries: Grocery[] = [];

  constructor(private familyService: FamilyService, private shoppingService: ShoppingService, private router : Router) {}

  ngOnInit(): void {
    this.shoppingService.mode = null;
    this.shoppingService.itemToEditIndex = null;
    this.groceries = this.familyService.family.groceries;
  }

  onTest() {
    this.groceries.forEach((el) => {
      el.completedAt = new Date();
    });
  }

  onCheck(index) {
    // this.groceries[index].completedAt
    //   ? (this.groceries[index].completedAt = null)
    //   : (this.groceries[index].completedAt = new Date());
    // this.sortList();
    this.clicked = null
    if(this.groceries[index].completedAt){
      this.groceries[index].completedAt = null
    } else {
      this.groceries[index].completedAt = new Date();
    }
    this.onSynchro();
  }

  onClickItem(index) {
    this.clicked == index ? (this.clicked = null) : (this.clicked = index);
  }

  onDrop(dropResult) {
    // update item list according to the @dropResult
    console.log(dropResult);
  }

  onEdit(index){
    this.shoppingService.mode = "edit";
    this.shoppingService.groceriesToEdit = this.groceries;
    this.shoppingService.itemToEditIndex = index;
    this.router.navigate(['', 'app', 'shopping', 'add']);
  }

  onSynchro(){
    this.isLoading = true;
    this.shoppingService.groceriesToEdit = this.groceries;
    this.shoppingService.editGrocery().subscribe(res => {
      this.familyService.family.groceries = res.data.groceries;
      this.isLoading = false;
    }) 
  }

  // sortList() {
  //   let incomplete = [];
  //   let complete = [];
  //   this.groceries.forEach((el) => {
  //     el.completedAt ? complete.push(el) : incomplete.push(el);
  //   });

  //   this.groceries = [...incomplete, ...complete];
  // }

  // moveItemToEnd(index){
  //   let item = this.groceries[index];
  //   this.groceries.splice(index,1);
  //   this.groceries.push(item);
  // } 
  // moveItemToStart(index){
  //   let item = this.groceries[index];
  //   this.groceries.splice(index, 1);
  //   this.groceries.unshift(item);
  // }
}
