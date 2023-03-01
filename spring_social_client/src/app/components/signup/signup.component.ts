import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { GOOGLE_AUTH_URL, GITHUB_AUTH_URL } from 'src/app/constants/constants';
import { IApiResponse } from 'src/app/model/IApiResponse';
import { ISignUp } from 'src/app/model/ISignUp';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.oAuth2ErrorSubscription = this._authService
      .getOAuth2Error()
      .subscribe((oAuth2Error) => {
        this.setOAuth2ErrorAndMessage(oAuth2Error.isError, oAuth2Error.errorMessage);
      });
    this._authService.setOAuth2ErrorRedirectURL("/signup");
   
  }

  ngOnDestroy(): void {
    this._authService.setOAuth2Error({ isError: false, errorMessage: ""});
    this.oAuth2ErrorSubscription.unsubscribe();
    this._authService.setOAuth2ErrorRedirectURL("/login");
    this.redirectUrlSubscription.unsubscribe();
  }

  faXmark = faXmark;
  faGoogle = faGoogle;
  faGithub = faGithub;
  GOOGLE_AUTH_URL: string = GOOGLE_AUTH_URL;
  GITHUB_AUTH_URL: string = GITHUB_AUTH_URL;
  isOAuth2Error: boolean = false;
  oAuth2ErrorMessage: string = '';
  oAuth2ErrorSubscription: Subscription = new Subscription();
  redirectUrlSubscription: Subscription = new Subscription();
  userSignUpPayload: ISignUp = {
    name: '',
    email: '',
    password: ''
  };
  signUpFormGroup = this._formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  signUpUserLoading: boolean = false;
  nameErrorMessage: string = '';
  emailErrorMessage: string = '';
  passwordErrorMessage: string = '';
  isSignUpError: boolean = false;
  signUpErrorMessage: string = 'Error signing up user!';

  goToComponent(path: string) {
    this._router.navigate([path]);
  }

  signUpUser(): void {
    if(this.signUpFormGroup.valid) {
      this.nameErrorMessage = "";
      this.emailErrorMessage = "";
      this.passwordErrorMessage = "";
      this.signUpUserLoading = true;
      this.userSignUpPayload.name = this.signUpFormGroup.get('name')?.value ?? '';
      this.userSignUpPayload.email = this.signUpFormGroup.get('email')?.value ?? '';
      this.userSignUpPayload.password = this.signUpFormGroup.get('password')?.value ?? '';
      this._authService.signup(this.userSignUpPayload).subscribe({
        next: (data: IApiResponse) => {
          this.signUpUserLoading = false;
          this.isSignUpError = false;
          this._router.navigate(["/login"]);
        },
        error: err => {
          this.signUpUserLoading = false;
          if(err && err.error && err.error.message) {
            this.setSignUpErrorAndMessage(true, err.error.message);
          }
        }
      })
    } else {
        this.nameErrorMessage = !this.signUpFormGroup.controls.name.errors ? "" : "Name is required!";
        this.emailErrorMessage = !this.signUpFormGroup.controls.email.errors ? "" : "Please enter a valid email!";
        this.passwordErrorMessage = !this.signUpFormGroup.controls.password.errors ? "" : "Password is required!"
    }
  }

  setSignUpErrorAndMessage(isError: boolean, msg: string): void {
    this.isSignUpError = isError;
    this.signUpErrorMessage = msg;
    this.hideErrorAfterDelay("signup");
  }

  setOAuth2ErrorAndMessage(isError: boolean, msg: string): void {
    this.isOAuth2Error = isError;
    this.oAuth2ErrorMessage = msg;
    this.hideErrorAfterDelay("oauth2");
  }

  hideErrorAfterDelay(errorType: string): void {
    switch(errorType) {
      case "signup":
        setTimeout(() => {
          this.isSignUpError = false;
          this.signUpErrorMessage = "";
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
