import { ProductsResponse } from './../utils/shoppingList.models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  ShoppingList,
  ShoppingListsResponse,
  ShoppingListResponse,
} from '../utils/shoppingList.models';

@Injectable({ providedIn: 'root' })
export class ShoppingService {
  mode: string;

  constructor(private http: HttpClient) {}

  listToEdit: ShoppingList;
  itemToEditIndex: number;

  getAllLists() {
    return this.http.get<ShoppingListsResponse>(
      `${environment.apiURL}shoppingLists/`
    );
  }

  getList(id) {
    return this.http.get<ShoppingListResponse>(
      `${environment.apiURL}shoppingLists/list/${id}`
    );
  }

  get10LastProducts() {
    return this.http.get<ProductsResponse>(
      `${environment.apiURL}shoppingLists/lastTen`
    );
  }

  addItemToList(id, item) {
    return this.http.post<ShoppingListResponse>(
      `${environment.apiURL}shoppingLists/add/${id}`,
      item
    );
  }

  editList(id, body) {
    return this.http.patch<ShoppingListResponse>(
      `${environment.apiURL}shoppingLists/edit/${id}`,
      body
    );
  }

  createList() {
    return this.http.post<ShoppingListsResponse>(
      `${environment.apiURL}shoppingLists/create`,
      this.listToEdit
    );
  }

  deleteList(id) {
    return this.http.delete<ShoppingListsResponse>(
      `${environment.apiURL}shoppingLists/delete/${id}`
    );
  }
}
