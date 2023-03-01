import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { filter, Subscription } from 'rxjs';
import { IOauth2Error } from 'src/app/model/IOauth2Error';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-oauth2redirecthandler',
  templateUrl: './oauth2redirecthandler.component.html',
  styleUrls: ['./oauth2redirecthandler.component.css'],
})
export class Oauth2redirecthandlerComponent implements OnInit {
  constructor(
    private _router: Router, 
    private _authService: AuthService,
    private _cookieService: CookieService) {}

  ngOnInit(): void {
   this.token = this.getUrlParameter('token');
    this.error = this.getUrlParameter('error');
    if (this.token) {
      // set token in cookies
      this._cookieService.set('accessToken', this.token, 10, "/");
      this._router.navigate(['/profile']);
    } else {
      // set the error details in behaviour subject and redirect to login page
      this.oAuth2Error.isError = true;
      this.oAuth2Error.errorMessage = this.error;
      this._authService.setOAuth2Error(this.oAuth2Error);
      this._router.navigate([this._authService.getOAuth2ErrorRedirectURL()]);
    }
    
  }

  ngOnDestroy(): void {
    this.redirectUrlSubscription.unsubscribe();
  }

  public href: string = '';
  token: string = '';
  error: string = '';
  oAuth2Error: IOauth2Error = {
    isError: false,
    errorMessage: '',
  };
  redirectUrl: string = '/login';
  redirectUrlSubscription: Subscription = new Subscription();

  getUrlParameter(name: string): string {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(this._router.url);
    return results === null
      ? ''
      : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
}
