import { ShoppingService } from './../shopping.service';
import { Router } from '@angular/router';
import { FamilyService } from './../../family.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopping-list-add',
  templateUrl: './shopping-list-add.component.html',
  styleUrls: ['./shopping-list-add.component.scss']
})
export class ShoppingListAddComponent implements OnInit {

  isLoading = false;

  constructor(private familyService: FamilyService, private router: Router, private shoppingService : ShoppingService) { }

  buttonTouched = false;
  timeoutHandler;
  mode: string;

  addFormGroup: FormGroup;

  ngOnInit(): void {
    this.isLoading = true;
    this.addFormGroup = new FormGroup({})
    this.addFormGroup.addControl('name', new FormControl('', [Validators.required]))
    this.addFormGroup.addControl('details', new FormControl(''))
    this.addFormGroup.addControl('quantity', new FormControl(0, [Validators.required, Validators.min(1)]))
    this.checkMode();
    this.isLoading = false;
  }

  onHold(mark){
    this.buttonTouched = true;
    if(mark == "minus"){
      this.timeoutHandler = setInterval(() => {
        this.addFormGroup.get("quantity").patchValue(this.addFormGroup.controls.quantity.value - 1);
        this.checkValid();
      }, 100)
    }
    if(mark == "plus"){
      this.timeoutHandler = setInterval(() => {
        this.addFormGroup.get("quantity").patchValue(this.addFormGroup.controls.quantity.value + 1);
      }, 100)
    }
  }

  onStopHold(){
    if(this.timeoutHandler){
      clearInterval(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  }

  onMarkClick(mark){
    this.buttonTouched = true;
    if(mark == 'minus'){
      this.addFormGroup.get("quantity").patchValue(this.addFormGroup.controls.quantity.value - 1);
      this.checkValid();
    }
    if(mark == 'plus'){
      this.addFormGroup.get("quantity").patchValue(this.addFormGroup.controls.quantity.value + 1);
    }
  }

  onAdd(){
    if(this.addFormGroup.invalid){
      this.buttonTouched = true;
      return;
    }
    this.isLoading = true;
    let grocery = {
      name: this.addFormGroup.controls.name.value,
      quantity: this.addFormGroup.controls.quantity.value,
      details: this.addFormGroup.controls.details.value
    }
    if(this.mode !=='edit'){
      this.shoppingService.addGrocery(grocery).subscribe(res => {
        this.familyService.family = res.data.family;
        this.isLoading = false;
        this.router.navigate(['', 'app', 'shopping'])
      })
    } else {
      this.shoppingService.groceriesToEdit[this.shoppingService.itemToEditIndex].item = grocery;
      this.shoppingService.editGrocery().subscribe(res => {
        this.familyService.family.groceries = res.data.groceries;
        this.router.navigate(['', 'app', 'shopping'])
        this.isLoading = false;
      })
    }
  }

  checkValid(){
    let value = this.addFormGroup.controls.quantity.value;
    if(value < 0){
      value = 0;
    }
    value = Math.trunc(value);
    this.addFormGroup.get("quantity").patchValue(value);
  }

  checkMode() {
    if(this.shoppingService.mode == "edit"){
      this.mode = 'edit';
      const item = this.shoppingService.groceriesToEdit[this.shoppingService.itemToEditIndex];
      this.addFormGroup.get("name").setValue(item.item.name)
      this.addFormGroup.get("quantity").setValue(item.item.quantity)
      this.addFormGroup.get("details").setValue(item.item.details);
    }
  }

}
