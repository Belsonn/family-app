import { HttpClient } from '@angular/common/http';
import {
  FamilyResponse,
  Grocery,
  ShoppingList,
  ShoppingListResponse,
} from './../utils/family.models';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ShoppingService {
  mode: string;

  constructor(private http: HttpClient) {}

  listClicked: ShoppingList;

  listToEdit: ShoppingList;
  itemToEditIndex: number;

  addGrocery(grocery) {
    return this.http.post<FamilyResponse>(
      `${environment.apiURL}family/addGrocery`,
      grocery
    );
  }

  editGrocery() {
    return this.http.patch<ShoppingListResponse>(
      `${environment.apiURL}family/editList`,
      this.listToEdit
    );
  }

  createList() {
    return this.http.post<ShoppingListResponse>(
      `${environment.apiURL}family/createList`,
      this.listToEdit
    );
  }

  deleteList(id) {
    return this.http.patch<ShoppingListResponse>(
      `${environment.apiURL}family/deleteList`,
      { id: id }
    );
  }
}
