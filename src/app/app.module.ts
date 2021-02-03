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
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { SmoothScrollModule } from 'ngx-scrollbar/smooth-scroll';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';

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
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingListAddComponent } from './shopping-list/shopping-list-add/shopping-list-add.component';
import { CustomLoadingComponent } from './custom-loading/custom-loading.component';
import { ShoppingListViewComponent } from './shopping-list/shopping-list-view/shopping-list-view.component';
import { ConfirmDeleteModalComponent } from './common/confirm-delete-modal/confirm-delete-modal.component';
import { CompleteConfirmModalComponent } from './shopping-list/complete-confirm-modal/complete-confirm-modal.component';
import { SmallLoadingComponent } from './common/small-loading/small-loading.component';
import { ChatComponent } from './chat/chat.component';
import { TaskCreateComponent } from './tasks/task-create/task-create.component';
import { DailyTaskComponent } from './tasks/daily-task/daily-task.component';
import { DailyTaskCreateComponent } from './tasks/daily-task/daily-task-create/daily-task-create.component';
import { DailyTaskConfirmChangesComponent } from './tasks/daily-task/daily-task-confirm-changes/daily-task-confirm-changes.component';
import { CompleteTaskComponent } from './tasks/CompleteAbandon/complete-task/complete-task.component';
import { AbandonTaskComponent } from './tasks/CompleteAbandon/abandon-task/abandon-task.component';
import { ConfirmDeleteDailyTaskComponent } from './tasks/daily-task/confirm-delete-daily-task/confirm-delete-daily-task.component';
import { ConfirmDeleteTaskComponent } from './tasks/confirm-delete-task/confirm-delete-task.component';
import { RewardsMainComponent } from './rewards/rewards-main/rewards-main.component';
import { RewardsCreateComponent } from './rewards/rewards-create/rewards-create.component';
import { RewardsUnlockedComponent } from './rewards/rewards-unlocked/rewards-unlocked.component';
import { UnlockRewardComponent } from './rewards/dialogs/unlock-reward/unlock-reward.component';
import { ConfirmRewardComponent } from './rewards/dialogs/confirm-reward/confirm-reward.component';
import { MyRewardsComponent } from './rewards/my-rewards/my-rewards.component';
import { ConfirmDeleteRewardComponent } from './rewards/dialogs/confirm-delete-reward/confirm-delete-reward.component';
import { SettingsMainComponent } from './settings/settings-main/settings-main.component';

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
    ShoppingListComponent,
    ShoppingListAddComponent,
    CustomLoadingComponent,
    ShoppingListViewComponent,
    ConfirmDeleteModalComponent,
    CompleteConfirmModalComponent,
    SmallLoadingComponent,
    ChatComponent,
    TaskCreateComponent,
    DailyTaskComponent,
    DailyTaskCreateComponent,
    DailyTaskConfirmChangesComponent,
    CompleteTaskComponent,
    AbandonTaskComponent,
    ConfirmDeleteDailyTaskComponent,
    ConfirmDeleteTaskComponent,
    RewardsMainComponent,
    RewardsCreateComponent,
    RewardsUnlockedComponent,
    UnlockRewardComponent,
    ConfirmRewardComponent,
    MyRewardsComponent,
    ConfirmDeleteRewardComponent,
    SettingsMainComponent,
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
    MatAutocompleteModule,
    NgxMaterialTimepickerModule,
    AngularColorfulModule,
    SmoothScrollModule,
    HammerModule,
    NgxSmoothDnDModule,
    NgScrollbarModule.withConfig({}),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
