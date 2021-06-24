import { SettingsService } from './../../settings/settings.service';
import { CompleteConfirmModalComponent } from './../complete-confirm-modal/complete-confirm-modal.component';
import { ConfirmDeleteModalComponent } from './../../common/confirm-delete-modal/confirm-delete-modal.component';
import { Router } from '@angular/router';
import { ShoppingService } from './../shopping.service';
import { FamilyService } from './../../family.service';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShoppingList } from 'src/app/utils/shoppingList.models';
import {
  animate,
  animateChild,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Settings } from 'src/app/utils/settings.models';

@Component({
  selector: 'app-shopping-list-view',
  templateUrl: './shopping-list-view.component.html',
  styleUrls: ['./shopping-list-view.component.scss'],
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
export class ShoppingListViewComponent implements OnInit {
  isLoading = false;
  isLoadingInit = false;
  shoppingLists: ShoppingList[];
  shoppingListsActive: ShoppingList[] = [];
  shoppingListsCompleted: ShoppingList[] = [];
  showComplete: boolean = false;

  editMode: number = null;

  type: string;

  nameRef: string;

  private createNew: boolean;

  isParent: boolean;
  settings: Settings;

  @ViewChildren('inputName') inputNames: QueryList<ElementRef>;
  @ViewChildren('list') DOMlists: QueryList<ElementRef>;

  constructor(
    private familyService: FamilyService,
    private shoppingService: ShoppingService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    public dialog: MatDialog,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.getDataFromSettings();
    this.getLists();
  }
  getDataFromSettings() {
    this.isParent = this.settingsService.isParent;
    this.settings = this.settingsService.settings;
  }

  getLists() {
    // Init List
    this.shoppingListsActive = [];
    this.shoppingListsCompleted = [];

    // Get list from back
    this.shoppingService.getAllLists().subscribe((res) => {
      let data = res.data.lists;
      data.forEach((list) => {
        list.completedAt == null
          ? this.shoppingListsActive.push(list)
          : this.shoppingListsCompleted.push(list);
      });

      //reverse list
      this.shoppingListsActive = this.shoppingListsActive.slice().reverse();
      this.shoppingListsCompleted = this.shoppingListsCompleted
        .slice()
        .reverse();

      this.isLoading = false;
      // this.shoppingLists = data.slice().reverse();
    });
  }

  reverseArray(array: Array<any>) {
    return array.slice().reverse();
  }

  onListClick(list: ShoppingList) {
    if (!this.editMode) {
      // this.shoppingService.listClicked = this.shoppingLists[index];
      this.router.navigate(['', 'app', 'shopping', 'list'], {
        queryParams: { id: list._id },
      });
    }
  }

  showCompleteClick() {
    if (!this.showComplete) {
      this.showComplete = !this.showComplete;
    } else {
      this.showComplete = !this.showComplete;
      this.familyService.scrollSub.next({ top: 0, duration: 1000 });
    }
  }

  runEditMode(index: number) {
    this.type = 'edit';
    this.editMode = index;
    this.nameRef = this.shoppingListsActive[index].name;
    this.changeDetector.detectChanges();
    this.inputNames.toArray()[0].nativeElement.focus();
  }
  exitEditMode() {
    if (
      this.shoppingListsActive[this.editMode].name.trim() == this.nameRef.trim()
    ) {
      this.shoppingListsActive[this.editMode].name.trim();
      this.editMode = null;
      return;
    }
    this.isLoading = true;
    this.shoppingService.listToEdit = this.shoppingListsActive[this.editMode];
    if (this.type == 'edit') {
      // Bring back if name changed to ''
      if (this.shoppingListsActive[this.editMode].name.trim() == '') {
        this.shoppingListsActive[this.editMode].name = this.nameRef;
        this.editMode = null;
        this.isLoading = false;
        return;
      }
      // Save updated
      this.shoppingService
        .editList(this.shoppingListsActive[this.editMode]._id, {
          name: this.shoppingListsActive[this.editMode].name,
        })
        .subscribe((res) => {
          this.shoppingListsActive[this.editMode] = res.data.list;
          this.editMode = null;
          this.isLoading = false;
        });
    } else if (this.type == 'new') {
      // Dont save if no name
      if (this.shoppingListsActive[this.editMode].name.trim() == '') {
        this.shoppingListsActive.splice(this.editMode, 1);
        this.editMode = null;
        this.isLoading = false;
        return;
      } else {
        // Save
        this.shoppingService.createList().subscribe((res) => {
          this.editMode = null;
          this.getLists();
        });
      }
    }
  }
  onAddNewList() {
    console.log(this.editMode);
    if (!this.isParent && !this.settings.shoppingLists.childCanCreateList) {
      return;
    }
    if (this.editMode != null) {
      this.exitEditMode();
    } else {
      let newList: ShoppingList = {
        name: '',
        list: [],
        createdBy: this.familyService.familyUser,
        createdAt: new Date(),
        completedAt: null,
      };
      this.createNew = false;
      this.type = 'new';
      this.nameRef = 'NOT THIS LIST';
      this.shoppingListsActive.unshift(newList);
      this.editMode = 0;
      this.changeDetector.detectChanges();
      this.inputNames.toArray()[0].nativeElement.focus();
    }
  }

  calcCompletedItems(list) {
    let completed = 0;
    list.list.forEach((el) => {
      el.completedAt ? completed++ : null;
    });
    return `${completed}/${list.list.length}`;
  }

  isAllComplete(list) {
    let complete = true;
    list.list.forEach((el) => {
      if (el.completedAt == null) {
        complete = false;
      }
    });
    return complete;
  }

  deleteClick(list: ShoppingList) {
    if (!this.isParent && !this.settings.shoppingLists.childCanDeleteList) {
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDeleteModalComponent, {
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onDeleteList(list);
      }
    });
  }

  onDeleteList(list: ShoppingList) {
    this.isLoading = true;
    if (!list._id) {
      this.shoppingListsActive.shift();
      (this.editMode = null), (this.isLoading = false);
    } else {
      this.shoppingService.deleteList(list._id).subscribe(
        (res) => {
          this.getLists();
        },
        (err) => {
          // console.log(err);
        }
      );
    }
  }

  onCompleteClick(list: ShoppingList) {
    if (
      list.completedAt ||
      (!this.isParent && !this.settings.shoppingLists.childCanCompleteList)
    ) {
      return;
    }
    const dialogRef = this.dialog.open(CompleteConfirmModalComponent, {
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onComplete(list);
      }
    });
  }

  onComplete(list: ShoppingList) {
    this.isLoading = true;
    this.shoppingService
      .editList(list._id, { completedAt: new Date() })
      .subscribe((res) => {
        this.getLists();
      });
  }
}
