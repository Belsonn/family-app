import { DailyTaskCreateComponent } from './tasks/daily-task/daily-task-create/daily-task-create.component';
import { DailyTaskComponent } from './tasks/daily-task/daily-task.component';
import { TaskCreateComponent } from './tasks/task-create/task-create.component';
import { ChatComponent } from './chat/chat.component';
import { ShoppingListViewComponent } from './shopping-list/shopping-list-view/shopping-list-view.component';
import { AuthGuard } from './auth/auth.guard';
import { ShoppingListAddComponent } from './shopping-list/shopping-list-add/shopping-list-add.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { EditMeComponent } from './edit-me/edit-me.component';
import { FamilyComponent } from './family/family.component';
import { PickUserComponent } from './pick-user/pick-user.component';
import { NofamilyComponent } from './nofamily/nofamily.component';
import { MenuComponent } from './menu/menu.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarEventComponent } from './calendar/calendar-event/calendar-event.component';
import { TasksComponent } from './tasks/tasks.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AppContainerComponent } from './app-container/app-container.component';
import { NamecreatorComponent } from './namecreator/namecreator.component';

const routes: Routes = [
  {
    path: 'app',
    component: AppContainerComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'signup',
        component: SignupComponent,
      },
      {
        path: 'join',
        component: NofamilyComponent,
      },
      {
        path: 'shopping',
        component: ShoppingListViewComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'shopping/list',
        component: ShoppingListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'shopping/add',
        component: ShoppingListAddComponent,
        canActivate: [AuthGuard]
      },
    
      {
        path: 'configureAccount',
        component: NamecreatorComponent,
      },
      {
        path: 'pickuser',
        component: PickUserComponent,
      },
      {
        path: 'updateAccount',
        component: EditMeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'family',
        component: FamilyComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'calendar',
        component: CalendarComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'calendar/event',
        component: CalendarEventComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'tasks',
        component: TasksComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'tasks/add',
        component: TaskCreateComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'tasks/daily',
        component: DailyTaskComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'tasks/daily/add',
        component: DailyTaskCreateComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'chat',
        component: ChatComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'menu',
        component: MenuComponent,
        canActivate: [AuthGuard]
      },
    ],
  },
  {
    path: '',
    component: HomeScreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
