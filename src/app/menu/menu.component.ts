import { Component, OnInit } from '@angular/core';
import planner from '@iconify/icons-flat-color-icons/planner'
import shoppingCart from '@iconify/icons-noto-v1/shopping-cart'
import chatBubbleLine from '@iconify/icons-clarity/chat-bubble-line';
import familyManWomanGirlBoy from '@iconify/icons-emojione-v1/family-man-woman-girl-boy';
import todoList from '@iconify/icons-flat-color-icons/todo-list';
import settingsIcon from '@iconify/icons-flat-color-icons/settings';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  
  planner = planner;
  shoppingCart = shoppingCart;
  chatBubbleLine = chatBubbleLine;
  familyManWomanGirlBoy = familyManWomanGirlBoy;
  todoList = todoList;
  settingsIcon = settingsIcon;

  constructor(private authService: AuthService, private router: Router) { }
  onTest(){
    console.log("elo");
  }
  ngOnInit(): void {
  }

  onLogout() {
    this.authService.logout();
  }
}
