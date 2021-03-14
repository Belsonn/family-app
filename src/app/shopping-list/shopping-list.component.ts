import { SettingsService } from './../settings/settings.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ShoppingService } from './shopping.service';
import { FamilyService } from './../family.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import {
  animate,
  animateChild,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppingList } from '../utils/shoppingList.models';
import { NgScrollbar } from 'ngx-scrollbar';
import { SmoothScroll } from 'ngx-scrollbar/smooth-scroll';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteModalComponent } from '../common/confirm-delete-modal/confirm-delete-modal.component';
import { Settings } from '../utils/settings.models';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
  animations: [
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
      transition(':enter', [query('@items', stagger(300, animateChild()))]),
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

  isParent: boolean;
  settings: Settings;

  constructor(
    private familyService: FamilyService,
    private shoppingService: ShoppingService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.initFormGroup();
    this.getDataFromSettings();
    this.checkQueryParams();
  }

  initFormGroup() {
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
  }

  allItemsComplete(): boolean {
    if (this.list.list.length == 0) {
      return true;
    } else {
      let complete = true;
      for (let i = 0; i < this.list.list.length; i++) {
        !this.list.list[i].completedAt ? (complete = false) : null;
      }
      return complete;
    }
  }

  checkQueryParams() {
    this.shoppingService.mode = null;
    this.shoppingService.itemToEditIndex = null;
    this.route.queryParams.subscribe((params) => {
      if (params.id) {
        this.shoppingService.getList(params.id).subscribe(
          (res) => {
            this.list = res.data.list;
            if (this.list.completedAt != null) {
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

  getDataFromSettings() {
    this.isParent = this.settingsService.isParent;
    this.settings = this.settingsService.settings;
  }

  onCreateClick() {
    if (this.disabled) {
      this.showInfo = true;
      return;
    } else if (
      !this.isParent &&
      !this.settings.shoppingLists.childCanAddItemToList
    ) {
      return;
    }
    this.router.navigate(['', 'app', 'shopping', 'add'], {
      queryParamsHandling: 'preserve',
    });
  }

  onCheck(index) {
    if (this.disabled) {
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
    if (
      this.disabled ||
      (!this.isParent && !this.settings.shoppingLists.childCanEditItemOnList)
    ) {
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
    if (
      this.disabled ||
      (!this.isParent && !this.settings.shoppingLists.childCanEditItemOnList)
    ) {
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
