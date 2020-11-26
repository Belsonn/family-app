export interface UserModelResponse {
  status: string;
  data: {
    user: UserModel;
  };
}

export interface UserModel {
  _id: string,
  name: string,
  email?: string
}
