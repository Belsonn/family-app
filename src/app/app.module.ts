import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID} from '@angular/core';
import localePl from '@angular/common/locales/pl';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import {MatSelectModule} from '@angular/material/select';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
import { IconModule } from '@visurel/iconify-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarComponent } from './calendar/calendar.component';
import { ChunkPipe } from './utils/Chunk.pipe';
import { HammerModule } from '@angular/platform-browser';
import { CalendarEventComponent } from './calendar/calendar-event/calendar-event.component';
import { TasksComponent } from './tasks/tasks.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    CalendarComponent,
    ChunkPipe,
    CalendarEventComponent,
    TasksComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    IconModule,
    MatButtonModule,
    MatRippleModule,
    MatBadgeModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatStepperModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSelectModule,
    NgxMaterialTimepickerModule,
    HammerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
