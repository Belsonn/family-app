import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatButtonModule} from '@angular/material/button';
import {MatRippleModule} from '@angular/material/core';
import {MatBadgeModule} from '@angular/material/badge';
import {MatIconModule} from '@angular/material/icon';

import { FormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
import { IconModule } from '@visurel/iconify-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarComponent, ChunkPipe } from './calendar/calendar.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    CalendarComponent,
    ChunkPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    IconModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatRippleModule,
    MatBadgeModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
