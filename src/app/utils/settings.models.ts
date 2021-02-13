export interface Settings {
  calendar: {
    childCanCreateEvents: boolean;
    childCanEditEvents: boolean;
    childCanDeleteEvents: boolean;
  };
  shoppingLists: {
    childCanCreateList: boolean;
    childCanEditList: boolean;
    childCanDeleteList: boolean;
    childCanAddItemToList: boolean;
    childCanEditItemOnList: boolean;
    childCanCompleteList: boolean;
  };
}



export interface SettingsResponse {
  status: string;
  data: {
    settings: Settings
  };
}

