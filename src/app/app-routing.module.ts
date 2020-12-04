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
        path: 'configureAccount',
        component: NamecreatorComponent,
      },
      {
        path: 'calendar',
        component: CalendarComponent,
      },
      {
        path: 'calendar/event',
        component: CalendarEventComponent,
      },
      {
        path: 'tasks',
        component: TasksComponent,
      },
      {
        path: 'menu',
        component: MenuComponent,
      },
    ],
  },
  {
    path: '',
    component: HomeScreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
