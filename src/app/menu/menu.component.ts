import { FamilyService } from './../family.service';
import { FamilyUser } from './../utils/family.models';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import planner from '@iconify/icons-flat-color-icons/planner';
import shoppingCart from '@iconify/icons-noto-v1/shopping-cart';
import chatBubbleLine from '@iconify/icons-clarity/chat-bubble-line';
import familyManWomanGirlBoy from '@iconify/icons-emojione-v1/family-man-woman-girl-boy';
import todoList from '@iconify/icons-flat-color-icons/todo-list';
import settingsIcon from '@iconify/icons-flat-color-icons/settings';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  isLoading = false;

  planner = planner;
  shoppingCart = shoppingCart;
  chatBubbleLine = chatBubbleLine;
  familyManWomanGirlBoy = familyManWomanGirlBoy;
  todoList = todoList;
  settingsIcon = settingsIcon;
  user: FamilyUser;

  constructor(
    private authService: AuthService,
    private familyService: FamilyService,
    private router: Router,
  ) {}
  onTest() {
    console.log('elo');
  }
  ngOnInit(): void {
    this.isLoading = true;
    if (!this.familyService.familyId || !this.familyService.familyUserId) {
      this.router.navigate(['']);
    }
    if (this.familyService.familyId && this.familyService.familyUserId) {
      this.familyService
        .getMeAndFamily(
          this.familyService.familyId,
          this.familyService.familyUserId
        )
        .subscribe((res) => {
          this.user = res.data.familyUser;
          this.isLoading = false;
        });
    }
  }

  onLogout() {
    this.authService.logout();
  }
}
