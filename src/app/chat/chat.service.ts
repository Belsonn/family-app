import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  private socket;


  constructor() { 
    this.socket = io(environment.apiURLBasic)
  }
}
