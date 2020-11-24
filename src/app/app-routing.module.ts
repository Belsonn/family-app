import { MenuComponent } from './menu/menu.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarEventComponent } from './calendar/calendar-event/calendar-event.component';
import { TasksComponent } from './tasks/tasks.component';

const routes: Routes = [
  {
    path: 'calendar',
    component: CalendarComponent,
  },
  {
    path:'calendar/event',
    component: CalendarEventComponent
  },
  {
    path:'tasks',
    component: TasksComponent
  },
  {
    path: '',
    component: MenuComponent 
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
