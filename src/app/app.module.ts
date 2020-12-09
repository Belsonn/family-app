import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ColorPickerModule } from 'ngx-color-picker';
import { AngularColorfulModule } from 'angular-colorful';
import { MatExpansionModule } from '@angular/material/expansion';
import { FileUploadModule } from 'ng2-file-upload';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
import { IconModule } from '@visurel/iconify-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarComponent } from './calendar/calendar.component';
import { ChunkPipe } from './utils/Chunk.pipe';
import { HammerModule } from '@angular/platform-browser';
import { CalendarEventComponent } from './calendar/calendar-event/calendar-event.component';
import { TasksComponent } from './tasks/tasks.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { PhoneBarComponent } from './phone-bar/phone-bar.component';
import { AppContainerComponent } from './app-container/app-container.component';
import { NofamilyComponent } from './nofamily/nofamily.component';
import { NamecreatorComponent } from './namecreator/namecreator.component';
import { PickUserComponent } from './pick-user/pick-user.component';
import { FamilyComponent } from './family/family.component';
import { EditMeComponent } from './edit-me/edit-me.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    CalendarComponent,
    ChunkPipe,
    CalendarEventComponent,
    TasksComponent,
    HomeScreenComponent,
    LoginComponent,
    SignupComponent,
    PhoneBarComponent,
    AppContainerComponent,
    NofamilyComponent,
    NamecreatorComponent,
    PickUserComponent,
    FamilyComponent,
    EditMeComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    IconModule,
    FileUploadModule,
    ColorPickerModule,
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
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    NgxMaterialTimepickerModule,
    AngularColorfulModule,
    HammerModule,
    NgScrollbarModule.withConfig({
      appearance: 'standard',
      visibility: 'always',
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
