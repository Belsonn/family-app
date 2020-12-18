import { ShoppingService } from './../shopping.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FamilyService } from './../../family.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopping-list-add',
  templateUrl: './shopping-list-add.component.html',
  styleUrls: ['./shopping-list-add.component.scss'],
})
export class ShoppingListAddComponent implements OnInit {
  isLoading = false;

  constructor(
    private familyService: FamilyService,
    private router: Router,
    private shoppingService: ShoppingService,
    private route: ActivatedRoute
  ) {}

  buttonTouched = false;
  timeoutHandler;
  mode: string;
  id: string;
  item;

  addFormGroup: FormGroup;

  ngOnInit(): void {
    this.isLoading = true;
    this.addFormGroup = new FormGroup({});
    this.addFormGroup.addControl(
      'name',
      new FormControl('', [Validators.required])
    );
    this.addFormGroup.addControl('details', new FormControl(''));
    this.addFormGroup.addControl(
      'quantity',
      new FormControl(0, [Validators.required, Validators.min(1)])
    );
    this.route.queryParams.subscribe((params) => {
      if (params.id) {
        this.shoppingService.getList(params.id).subscribe(
          (res) => {
            this.id = params.id;
            this.checkMode();
            this.isLoading = false;
          },
          (err) => {
            this.router.navigate(['', 'app', 'shopping']);
          }
        );
      } else {
        this.router.navigate(['', 'app', 'shopping']);
      }
    });
  }

  onHold(mark) {
    this.buttonTouched = true;
    if (mark == 'minus') {
      this.timeoutHandler = setInterval(() => {
        this.addFormGroup
          .get('quantity')
          .patchValue(this.addFormGroup.controls.quantity.value - 1);
        this.checkValid();
      }, 100);
    }
    if (mark == 'plus') {
      this.timeoutHandler = setInterval(() => {
        this.addFormGroup
          .get('quantity')
          .patchValue(this.addFormGroup.controls.quantity.value + 1);
      }, 100);
    }
  }

  onStopHold() {
    if (this.timeoutHandler) {
      clearInterval(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  }

  onMarkClick(mark) {
    this.buttonTouched = true;
    if (mark == 'minus') {
      this.addFormGroup
        .get('quantity')
        .patchValue(this.addFormGroup.controls.quantity.value - 1);
      this.checkValid();
    }
    if (mark == 'plus') {
      this.addFormGroup
        .get('quantity')
        .patchValue(this.addFormGroup.controls.quantity.value + 1);
    }
  }

  onAdd() {
    if (this.addFormGroup.invalid) {
      //  this.buttonTouched = true;
      return;
    }
    this.isLoading = true;
    let item = {
      name: this.addFormGroup.controls.name.value,
      quantity: this.addFormGroup.controls.quantity.value,
      details: this.addFormGroup.controls.details.value,
    };
    if (this.mode !== 'edit') {
      this.shoppingService.addItemToList(this.id, item).subscribe((res) => {
        this.isLoading = false;
        this.router.navigate(['', 'app', 'shopping', 'list'], {
          queryParamsHandling: 'preserve',
        });
      });
    } else {
        this.item.name = this.addFormGroup.controls.name.value,
        this.item.quantity = this.addFormGroup.controls.quantity.value,
        this.item.details = this.addFormGroup.controls.details.value,
      
      this.shoppingService.listToEdit.list[
        this.shoppingService.itemToEditIndex
      ] = this.item;
      this.shoppingService.editList(this.id, this.shoppingService.listToEdit).subscribe((res) => {
        
        this.router.navigate(['', 'app', 'shopping', 'list'], {queryParamsHandling: 'preserve'});
        this.isLoading = false;
      });
    }
  }

  checkValid() {
    let value = this.addFormGroup.controls.quantity.value;
    if (value < 0) {
      value = 0;
    }
    value = Math.trunc(value);
    this.addFormGroup.get('quantity').patchValue(value);
  }

  checkMode() {
    if (this.shoppingService.mode == 'edit') {
      this.mode = 'edit';
      this.item = this.shoppingService.listToEdit.list[
        this.shoppingService.itemToEditIndex
      ];
      this.addFormGroup.get('name').setValue(this.item.name);
      this.addFormGroup.get('quantity').setValue(this.item.quantity);
      this.addFormGroup.get('details').setValue(this.item.details);
    }
  }
}
