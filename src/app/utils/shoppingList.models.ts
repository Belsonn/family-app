import { FamilyUser } from "./family.models";

export interface Grocery {
    _id?: string;
    name: string;
    quantity: number;
    details: string;
    createdBy: FamilyUser;
    createdAt: Date;
    completedAt: Date;
  }
  
  export interface ShoppingListsResponse {
    status: string;
    data: {
      lists: ShoppingList[];
    };
  }
  
  export interface ShoppingListResponse {
    status: string;
    data: {
      list: ShoppingList;
    };
  }
  
  export interface ShoppingList {
    _id?: string;
    name: string;
    list: Grocery[];
    createdBy: FamilyUser;
    completedAt: Date;
  }
  