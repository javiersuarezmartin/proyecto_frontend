import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms';

// Components
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MainComponent } from './components/main/main.component';
import { UserComponent } from './components/user/user.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { HourComponent } from './components/hour/hour.component';
import { DateSelectorComponent } from './components/date-selector/date-selector.component';
import { ModalConfirmComponent } from './components/modal-confirm/modal-confirm.component';
import { AdminComponent } from './components/admin/admin.component';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    NavbarComponent,
    MainComponent,
    UserComponent,
    CalendarComponent,
    HourComponent,
    DateSelectorComponent,
    ModalConfirmComponent,
    AdminComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule    
  ],
  providers: [AuthGuard, AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
