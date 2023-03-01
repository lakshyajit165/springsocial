import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { Oauth2redirecthandlerComponent } from './components/oauth2redirecthandler/oauth2redirecthandler.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './utils/auth.guard';
import { AuthRouteGuard } from './utils/authroute.guard';

const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthRouteGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [AuthRouteGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'oauth2/redirect', component: Oauth2redirecthandlerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
