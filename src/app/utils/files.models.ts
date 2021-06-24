export interface Icon {
  id?: string;
  file: string;
}

export interface IconResponse {
  status: string;
  data: {
    icons: Icon[];
  };
}
