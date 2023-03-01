import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignupComponent } from './components/signup/signup.component';
import { Oauth2redirecthandlerComponent } from './components/oauth2redirecthandler/oauth2redirecthandler.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './utils/AuthInterceptor';
import { AuthGuard } from './utils/auth.guard';
import { AuthRouteGuard } from './utils/authroute.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    Oauth2redirecthandlerComponent,
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule, 
    FontAwesomeModule, 
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ CookieService, {
      provide : HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi   : true,
    },
    AuthGuard,
    AuthRouteGuard
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
