import { HttpClient } from '@angular/common/http';
import {
  FamilyResponse,
  Grocery,
  GroceryResponse,
} from './../utils/family.models';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ShoppingService {
  mode: string;

  constructor(private http: HttpClient) {}

  groceriesToEdit: Grocery[];
  itemToEditIndex: number;

  addGrocery(grocery) {
    return this.http.post<FamilyResponse>(
      `${environment.apiURL}family/addGrocery`,
      grocery
    );
  }

  editGrocery() {
    return this.http.patch<GroceryResponse>(
      `${environment.apiURL}family/editGroceries`,
      {
          groceries: this.groceriesToEdit
      }
    );
  }
}
