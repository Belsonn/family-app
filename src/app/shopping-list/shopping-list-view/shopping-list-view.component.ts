import { ConfirmDeleteModalComponent } from './../../common/confirm-delete-modal/confirm-delete-modal.component';
import { ShoppingList, ShoppingListResponse } from './../../utils/family.models';
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

@Component({
  selector: 'app-shopping-list-view',
  templateUrl: './shopping-list-view.component.html',
  styleUrls: ['./shopping-list-view.component.scss'],
})
export class ShoppingListViewComponent implements OnInit {
  isLoading = false;

  shoppingLists: ShoppingList[];

  editMode: number;

  type: string;

  nameRef: string;

  @ViewChildren('inputName') inputNames: QueryList<ElementRef>;

  constructor(
    private familyService: FamilyService,
    private shoppingService: ShoppingService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.shoppingService.listClicked = null;
    this.editMode = -1;
    this.shoppingLists = this.familyService.family.groceries;
  }

  onListClick(index) {
    this.shoppingService.listClicked = this.shoppingLists[index];
    this.router.navigate(['', 'app', 'shopping', 'list']);
  }

  runEditMode(index) {
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
        return;
      }
      // Save updated
      this.shoppingService.editGrocery().subscribe((res) => {
        this.changeData(res);
        this.editMode = null;
        this.isLoading = false;
      });
    } else if (this.type == 'new') {

      // Dont save if no name
      if (this.shoppingLists[this.editMode].name.trim() == '') {
        this.shoppingLists.splice(this.editMode, 1);
        this.editMode = null;
        this.isLoading = false;
        return;
      }
      // Save
      this.shoppingService.createList().subscribe((res) => {
        this.changeData(res);
        this.editMode = null;
        this.isLoading = false;
      });
    }
  }
  onAddNewList() {
    let newList: ShoppingList = {
      name: '',
      list: [],
    };
    this.type = 'new';
    this.shoppingLists.push(newList);
    this.editMode = this.shoppingLists.length - 1;
    this.changeDetector.detectChanges();
    this.inputNames.toArray()[0].nativeElement.focus();
  }

  deleteClick(id) {
    const dialogRef = this.dialog.open(ConfirmDeleteModalComponent, {
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.onDeleteList(id);
      }
    })
  }


  onDeleteList(i) {
    this.isLoading = true;
    this.shoppingService.deleteList(this.shoppingLists[i]._id).subscribe(res => {
      this.changeData(res);
      this.isLoading = false;
    })
  }
  changeData(res: ShoppingListResponse){
    this.shoppingLists = res.data.groceries;
    this.familyService.family.groceries = res.data.groceries;
  }
}
