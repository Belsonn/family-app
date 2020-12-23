import { Observable } from 'rxjs';
import { Grocery } from './../../utils/shoppingList.models';
import { ShoppingService } from './../shopping.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FamilyService } from './../../family.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  animateChild,
} from '@angular/animations';

@Component({
  selector: 'app-shopping-list-add',
  templateUrl: './shopping-list-add.component.html',
  styleUrls: ['./shopping-list-add.component.scss'],
  animations: [
    trigger('items', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }), // initial
        animate(
          '1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(1)', opacity: 1 })
        ), // final
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1, height: '*' }),
        animate(
          '1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({
            transform: 'scale(0.5)',
            opacity: 0,
            height: '0px',
            margin: '0px',
          })
        ),
      ]),
    ]),
    trigger('list', [
      transition(':enter', [query('@items', stagger(150, animateChild()))]),
    ]),
  ],
})
export class ShoppingListAddComponent implements OnInit {
  isLoading = false;
  isLoadingInit = false;
  products: Grocery[] = [];
  productsToShow: Grocery[] = [];
  filteredProducts: Grocery[];

  constructor(
    private familyService: FamilyService,
    private router: Router,
    private shoppingService: ShoppingService,
    private route: ActivatedRoute
  ) {}

  showRecently: boolean = false;
  buttonTouched = false;
  timeoutHandler;
  mode: string;
  id: string;
  item;

  addFormGroup: FormGroup;

  ngOnInit(): void {
    this.isLoading = true;
    this.generateFormGroup();
    this.checkQueryParams();
    this.shoppingService.getAllLists().subscribe((res) => {
      res.data.lists.forEach((el) => {
        this.products.push(...el.list);
      });
      this.products.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      this.productsToShow = this.products;
      const howMuch = this.products.length - 10;
      if (howMuch > 0) {
        this.productsToShow.splice(9, howMuch);
      }
      this.isLoading = false;
    });
  }

  generateFormGroup() {
    this.addFormGroup = new FormGroup({});
    this.addFormGroup.addControl(
      'name',
      new FormControl('', [Validators.required])
    );
    this.addFormGroup.addControl('details', new FormControl(''));
    this.addFormGroup.addControl(
      'quantity',
      new FormControl(1, [Validators.required, Validators.min(1)])
    );
  }

  checkQueryParams() {
    this.route.queryParams.subscribe((params) => {
      if (params.id) {
        this.shoppingService.getList(params.id).subscribe(
          (res) => {
            this.id = params.id;
            this.checkMode();
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

  showRecentlyClick() {
    this.showRecently = !this.showRecently;
    console.log(this.filteredProducts);
  }

  onProductClick(index: number) {
    const product = this.productsToShow[index];
    this.addFormGroup.get('name').setValue(product.name);
    this.addFormGroup.get('details').setValue(product.details);
    this.familyService.scrollSub.next({ bottom: 0 });
  }

  onHold(mark: string) {
    this.buttonTouched = true;
    if (mark == 'minus') {
      this.timeoutHandler = setInterval(() => {
        this.addFormGroup
          .get('quantity')
          .patchValue(this.addFormGroup.controls.quantity.value - 1);
        this.checkValid();
      }, 150);
    }
    if (mark == 'plus') {
      this.timeoutHandler = setInterval(() => {
        this.addFormGroup
          .get('quantity')
          .patchValue(this.addFormGroup.controls.quantity.value + 1);
      }, 150);
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
      this.buttonTouched = true;
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
      (this.item.name = this.addFormGroup.controls.name.value),
        (this.item.quantity = this.addFormGroup.controls.quantity.value),
        (this.item.details = this.addFormGroup.controls.details.value),
        (this.shoppingService.listToEdit.list[
          this.shoppingService.itemToEditIndex
        ] = this.item);
      this.shoppingService
        .editList(this.id, this.shoppingService.listToEdit)
        .subscribe((res) => {
          this.router.navigate(['', 'app', 'shopping', 'list'], {
            queryParamsHandling: 'preserve',
          });
          this.isLoading = false;
        });
    }
  }

  checkValid() {
    this.buttonTouched = true;
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
