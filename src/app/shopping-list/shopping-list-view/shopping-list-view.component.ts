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

@Component({
  selector: 'app-shopping-list-view',
  templateUrl: './shopping-list-view.component.html',
  styleUrls: ['./shopping-list-view.component.scss'],
})
export class ShoppingListViewComponent implements OnInit {
  isLoading = false;

  shoppingLists: ShoppingList[];

  editMode: number = null;

  type: string;

  nameRef: string;

  private createNew: boolean;

  @ViewChildren('inputName') inputNames: QueryList<ElementRef>;

  constructor(
    private familyService: FamilyService,
    private shoppingService: ShoppingService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getLists();
  }

  getLists() {
    this.isLoading = true;
    this.shoppingService.getAllLists().subscribe((res) => {
      let data = res.data.lists;
      this.shoppingLists = data.slice().reverse();
      this.isLoading = false;
    });
  }

  reverseArray(array: Array<any>) {
    return array.slice().reverse();
  }

  onListClick(index: number) {
    // this.shoppingService.listClicked = this.shoppingLists[index];
    this.router.navigate(['', 'app', 'shopping', 'list'], {
      queryParams: { id: this.shoppingLists[index]._id },
    });
  }

  runEditMode(index: number) {
    this.type = 'edit';
    this.editMode = index;
    this.nameRef = this.shoppingLists[index].name;
    this.changeDetector.detectChanges();
    this.inputNames.toArray()[0].nativeElement.focus();
  }
  exitEditMode() {
    if (this.shoppingLists[this.editMode].name == this.nameRef) {
      this.editMode = null;
      return;
    }
    this.isLoading = true;
    this.shoppingService.listToEdit = this.shoppingLists[this.editMode];
    if (this.type == 'edit') {
      // Bring back if name changed to ''
      if (this.shoppingLists[this.editMode].name.trim() == '') {
        this.shoppingLists[this.editMode].name = this.nameRef;
        this.editMode = null;
        this.isLoading = false;
        if (this.createNew) {
          return this.onAddNewList();
        }
        return;
      }
      // Save updated
      this.shoppingService
        .editList(this.shoppingLists[this.editMode]._id, {
          name: this.shoppingLists[this.editMode].name,
        })
        .subscribe((res) => {
          this.shoppingLists[this.editMode] = res.data.list;
          this.editMode = null;
          this.isLoading = false;
          if (this.createNew) {
            this.onAddNewList();
          }
        });
    } else if (this.type == 'new') {
      // Dont save if no name
      if (this.shoppingLists[this.editMode].name.trim() == '') {
        this.shoppingLists.splice(this.editMode, 1);
        this.editMode = null;
        this.isLoading = false;
        if (this.createNew) {
          return this.onAddNewList();
        }
        return;
      }
      // Save
      this.shoppingService.createList().subscribe((res) => {
        this.shoppingLists = this.reverseArray(res.data.lists);
        this.editMode = null;
        this.isLoading = false;
        if (this.createNew) {
          this.onAddNewList();
        }
      });
    }
  }
  onAddNewList() {
    if (this.editMode != null) {
      this.createNew = true;
      this.exitEditMode();
    } else {
      let newList: ShoppingList = {
        name: '',
        list: [],
        createdBy: this.familyService.familyUser,
        completedAt: null,
      };
      this.createNew = false;
      this.type = 'new';
      this.shoppingLists.unshift(newList);
      this.editMode = 0;
      this.changeDetector.detectChanges();
      this.inputNames.toArray()[0].nativeElement.focus();
    }
  }

  deleteClick(id: string) {
    const dialogRef = this.dialog.open(ConfirmDeleteModalComponent, {
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onDeleteList(id);
      }
    });
  }

  calcCompletedItems(index) {
    let completed = 0;
    this.shoppingLists[index].list.forEach((el) => {
      el.completedAt ? completed++ : null;
    });
    return `${completed}/${this.shoppingLists[index].list.length}`;
  }

  isAllComplete(index) {
    let complete = true;
    this.shoppingLists[index].list.forEach((el) => {
      if (el.completedAt == null) {
        complete = false;
      }
    });
    return complete;
  }

  onDeleteList(i) {
    this.isLoading = true;
    if (!this.shoppingLists[i]._id) {
      this.shoppingLists.shift();
      (this.editMode = null), (this.isLoading = false);
    } else {
      this.shoppingService.deleteList(this.shoppingLists[i]._id).subscribe(
        (res) => {
          this.shoppingLists = this.reverseArray(res.data.lists);
          this.isLoading = false;
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  onCompleteClick(index) {
    const dialogRef = this.dialog.open(CompleteConfirmModalComponent, {
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onComplete(index);
      }
    });
  }

  onComplete(index) {
    this.isLoading = true;
    this.shoppingService
      .editList(this.shoppingLists[index]._id, { completedAt: new Date() })
      .subscribe((res) => {
        this.shoppingLists[index] = res.data.list;
        this.isLoading = false;
      });
  }
}
