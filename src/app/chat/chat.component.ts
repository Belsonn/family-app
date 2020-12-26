import { FamilyService } from './../family.service';
import { Subscription } from 'rxjs';
import { ChatService } from './chat.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message } from '../utils/chat.models';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-10rem)', opacity: 0 }),
        animate(
          '0.5s ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '0.5s ease-in',
          style({ transform: 'translateX(-10rem)', opacity: 0 })
        ),
      ]),
    ]),
    trigger('upAndDown', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('0.2s ease-in', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate('0.2s ease-out', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class ChatComponent implements OnInit, OnDestroy {
  isLoading = true;
  messageLoading = false;
  myId: string;

  messages: Message[] = [];
  message: string = '';

  newMessageSound;
  messageSendSound;

  showDate: number;

  focusedInput: boolean = false;

  private messageSub: Subscription;
  private loadMessageSub: Subscription;

  noLongerLoadMessage: boolean = false;

  constructor(
    private chatService: ChatService,
    private familyService: FamilyService
  ) {}

  ngOnInit(): void {
    this.loadAudio();

    this.subscribeForNewMessage();

    this.subscribeForMoreMessages();

    this.myId = this.familyService.familyUser._id;

    this.getInitMessages();
  }

  subscribeForMoreMessages() {
    this.loadMessageSub = this.chatService.loadMoreMessageSub.subscribe(
      (obs) => {
        if (this.noLongerLoadMessage) {
          this.loadMessageSub.unsubscribe();
          return;
        }
        this.messageLoading = true;
        this.chatService
          .loadMoreMessages(this.messages.length)
          .subscribe((res) => {
            res.data.messages.length < 20
              ? (this.noLongerLoadMessage = true)
              : null;
            res.data.messages !== null
              ? this.messages.unshift(...res.data.messages)
              : (this.noLongerLoadMessage = true);
            this.messageLoading = false;
            console.log(this.messages)
          });
      }
    );
  }

  subscribeForNewMessage() {
    this.messageSub = this.chatService
      .getNewMessages()
      .subscribe((message: Message) => {
        this.messages.push(message);

        if (message.createdBy._id !== this.myId) {
          this.newMessageSound.play();
        }

        this.familyService.scrollSub.next({ bottom: 0 });
      });
  }

  loadAudio() {
    this.messageSendSound = new Audio();
    this.messageSendSound.src = '../../assets/MessageSend.mp3';
    this.messageSendSound.load();

    this.newMessageSound = new Audio();
    this.newMessageSound.src = '../../assets/soft_notification.mp3';
    this.messageSendSound.load();
  }

  getInitMessages() {
    this.chatService.getInitMessages().subscribe((res) => {
      this.messages = res.data.messages;
      this.familyService.scrollSub.next({ bottom: 0, duration: 0 });
      this.isLoading = false;
    });
  }

  onSend() {
    if (this.message.trim() == '') {
      return;
    }
    const messageToSend = this.message;
    this.message = '';
    this.messageSendSound.play();
    this.chatService.addNewMessage(messageToSend).subscribe(
      (res) => {
        this.familyService.scrollSub.next({ bottom: 0, duration: 0 });
      },
      (err) => {
        // ?
      }
    );
  }

  showDateFn(index) {
    this.showDate == index ? (this.showDate = null) : (this.showDate = index);
  }

  showHeader(index): boolean {
    if (index == 0) {
      return false;
    }
    let date = new Date(this.messages[index].date);
    let nextDate = new Date(this.messages[index - 1].date);

    date.setHours(0, 0, 0, 0);
    nextDate.setHours(0, 0, 0, 0);

    return date.getTime() == nextDate.getTime() ? false : true;
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
    this.loadMessageSub.unsubscribe();
  }
}
