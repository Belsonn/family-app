import {
  MessagesResponse,
  SingleMessageResponse,
} from './../utils/chat.models';
import { HttpClient } from '@angular/common/http';
import { observable, Observable, Subject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket;

  constructor(private http: HttpClient) {
    this.socket = io(environment.apiURLBasic);
  }

  // sendMessage(message) {
  //   this.socket.emit('new-message', message);
  // }

  getAllMessages() {
    return this.http.get<MessagesResponse>(`${environment.apiURL}chat`);
  }
  
  addNewMessage(message) {
    return this.http.post<SingleMessageResponse>(
      `${environment.apiURL}chat/add`,
      {
        message: message,
      }
    );
  }

  getNewMessages = () => {
    return new Observable((observable) => {
      this.socket.on('new-message', (message) => {
        observable.next(message);
      });
    });
  };
}
