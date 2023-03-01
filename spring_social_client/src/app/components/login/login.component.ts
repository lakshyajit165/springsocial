import { Component, OnInit } from '@angular/core';
import { GITHUB_AUTH_URL, GOOGLE_AUTH_URL } from 'src/app/constants/constants';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { IOauth2Error } from 'src/app/model/IOauth2Error';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ILogin } from 'src/app/model/ILogin';
import { CookieService } from 'ngx-cookie-service';
import { ILoginResponse } from 'src/app/model/ILoginResponse';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private _router: Router, 
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _cookieService: CookieService
    ) {}

  ngOnInit(): void {
    this.oAuth2ErrorSubscription = this._authService
      .getOAuth2Error()
      .subscribe((oAuth2Error) => {
        this.setOAuth2ErrorAndMessage(oAuth2Error.isError, oAuth2Error.errorMessage);
      });
    this._authService.setOAuth2ErrorRedirectURL("/login");
  }

  ngOnDestroy(): void {
    this._authService.setOAuth2Error({ isError: false, errorMessage: ""});
    this.oAuth2ErrorSubscription.unsubscribe();
  }

  faXmark = faXmark;
  faGoogle = faGoogle;
  faGithub = faGithub;
  GOOGLE_AUTH_URL: string = GOOGLE_AUTH_URL;
  GITHUB_AUTH_URL: string = GITHUB_AUTH_URL;
  isOAuth2Error: boolean = false;
  oAuth2ErrorMessage: string = '';
  oAuth2ErrorSubscription: Subscription = new Subscription();
  userLoginPayload: ILogin = {
    email: '',
    password: ''
  };
  loginFormGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  loginUserLoading: boolean = false;
  emailErrorMessage: string = '';
  passwordErrorMessage: string = '';
  isLoginError: boolean = false;
  loginErrorMessage: string = 'Error logging in user!';

  goToComponent(path: string): void {
    this._router.navigate([path]);
  }
  
  loginUser(): void {
    if(this.loginFormGroup.valid) {
      this.emailErrorMessage = "";
      this.passwordErrorMessage = "";
      this.loginUserLoading = true;
      this.userLoginPayload.email = this.loginFormGroup.get('email')?.value ?? '';
      this.userLoginPayload.password = this.loginFormGroup.get('password')?.value ?? '';
      this._authService.login(this.userLoginPayload).subscribe({
        next: (data: ILoginResponse) => {
          this.loginUserLoading = false;
          this.isLoginError = false;
          this._cookieService.set('accessToken', data.accessToken, 10, "/");
          this._router.navigate(["/profile"]);
        },
        error: err => {
          this.loginUserLoading = false;
          if(err && err.error && err.error.message) {
            this.setLoginErrorAndMessage(true, err.error.message);
          }
        }
      })
    } else {
        this.emailErrorMessage = !this.loginFormGroup.controls.email.errors ? "" : "Please enter a valid email!";
        this.passwordErrorMessage = !this.loginFormGroup.controls.password.errors ? "" : "Password is required!"
    }
  }

  setLoginErrorAndMessage(isError: boolean, msg: string): void {
    this.isLoginError = isError;
    this.loginErrorMessage = msg;
    this.hideErrorAfterDelay("login");
  }

  setOAuth2ErrorAndMessage(isError: boolean, msg: string): void {
    this.isOAuth2Error = isError;
    this.oAuth2ErrorMessage = msg;
    this.hideErrorAfterDelay("oauth2");
  }

  hideErrorAfterDelay(errorType: string): void {
    switch(errorType) {
      case "login":
        setTimeout(() => {
          this.isLoginError = false;
          this.loginErrorMessage = "";
        }, 3000);
        break;
      case "oauth2":
        setTimeout(() => {
          this.isOAuth2Error = false;
          this.oAuth2ErrorMessage = "";
        }, 3000);
        break;
      default:
        break;
    }
    
  }
}
