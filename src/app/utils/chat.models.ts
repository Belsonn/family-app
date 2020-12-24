import { FamilyUser } from 'src/app/utils/family.models';
export interface Message {
  id?: string;
  date: Date;
  message: string;
  createdBy: FamilyUser
}

export interface MessagesResponse {
  status: string;
  data: {
    messages: [Message];
  };
}
export interface SingleMessageResponse {
  status: string;
  data: {
    message: Message
  };
}
