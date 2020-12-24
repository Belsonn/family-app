import { FamilyService } from './../family.service';
import { Subscription } from 'rxjs';
import { ChatService } from './chat.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { Message } from '../utils/chat.models';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  isLoading = true;
  myId: string;

  messages: Message[] = [];
  message: string;
  messageHeight: number;

  private messageSub: Subscription;

  constructor(
    private chatService: ChatService,
    private familyService: FamilyService,
    private det: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.messageSub = this.chatService
      .getNewMessages()
      .subscribe((message: Message) => {
        this.messages.push(message);
        this.familyService.scrollSub.next({ bottom: 0 });
      });
    this.myId = this.familyService.familyUser._id;
    this.chatService.getAllMessages().subscribe((res) => {
      this.messages = res.data.messages;
      this.familyService.scrollSub.next({ bottom: 0, duration: 0 });
      this.isLoading = false;
    });
  }

  onSend() {
    this.chatService.addNewMessage(this.message).subscribe(
      (res) => {
        this.message = '';
        this.familyService.scrollSub.next({ bottom: 0, duration: 0 });
      },
      (err) => {
        // ?
      }
    );
  }

  myNextMessage(index) {
    if (index == this.messages.length - 1) {
      return false;
    }
    return this.messages[index].createdBy._id ===
      this.messages[index + 1].createdBy._id
      ? true
      : false;
  }

  myLastMessage(index) {
    if (index == 0) {
      return false;
    }
    return this.messages[index].createdBy._id ===
      this.messages[index - 1].createdBy._id
      ? true
      : false;
  }

  ngOnDestroy(): void {
    this.messageSub.unsubscribe();
  }
}
