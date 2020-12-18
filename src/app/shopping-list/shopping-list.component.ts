import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ShoppingService } from './shopping.service';
import { FamilyService } from './../family.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppingList } from '../utils/shoppingList.models';
import { NgScrollbar } from 'ngx-scrollbar';
import { SmoothScroll } from 'ngx-scrollbar/smooth-scroll';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteModalComponent } from '../common/confirm-delete-modal/confirm-delete-modal.component';

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
  disabled: boolean = false;
  showInfo: boolean = false;

  list: ShoppingList;

  addFormGroup: FormGroup;

  constructor(
    private familyService: FamilyService,
    private shoppingService: ShoppingService,
    private router: Router,
    private route: ActivatedRoute,
    private det: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}

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

    this.shoppingService.mode = null;
    this.shoppingService.itemToEditIndex = null;
    this.route.queryParams.subscribe((params) => {
      if (params.id) {
        this.shoppingService.getList(params.id).subscribe(
          (res) => {
            this.list = res.data.list;
            if(this.list.completedAt != null){
              this.disabled = true;
              this.showInfo = true;
            }
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

  onCreateClick(){
    if(this.disabled){
      this.showInfo = true;
      return;
    }
    this.router.navigate(['', 'app', 'shopping', 'list', 'add'], {queryParamsHandling: 'preserve'});
  }

  onCheck(index) {
    if(this.disabled){
      return;
    }
    if (this.list.list[index].completedAt) {
      this.list.list[index].completedAt = null;
    } else {
      this.list.list[index].completedAt = new Date();
    }
    this.onSynchro();
  }

  onClickItem(index) {
    this.clicked == index ? (this.clicked = null) : (this.clicked = index);
  }

  onEdit(index) {
    if(this.disabled){
      return;
    }
    this.shoppingService.mode = 'edit';
    this.shoppingService.listToEdit = this.list;
    this.shoppingService.itemToEditIndex = index;
    this.router.navigate(['', 'app', 'shopping', 'add'], {
      queryParamsHandling: 'preserve',
    });
  }

  onSynchro() {
    this.isLoading = true;
    this.shoppingService.editList(this.list._id, this.list).subscribe((res) => {
      this.list = res.data.list;
      this.isLoading = false;
    });
  }

  onDeleteClick(index) {
    if(this.disabled){
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDeleteModalComponent, {
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onDeleteItem(index);
      }
    });
  }

  onDeleteItem(index) {
    this.isLoading = true;
    this.list.list.splice(index, 1);
    this.onSynchro();
  }
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
