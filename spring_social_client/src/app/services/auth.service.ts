import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IOauth2Error } from '../model/IOauth2Error';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../constants/constants';
import { IUser } from '../model/IUser';
import { CookieService } from 'ngx-cookie-service';
import { ILoginResponse } from '../model/ILoginResponse';
import { ILogin } from '../model/ILogin';
import { ISignUp } from '../model/ISignUp';
import { IApiResponse } from '../model/IApiResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private _http: HttpClient,
    private _cookieService: CookieService
  ) {}


  private _oAuth2ErrorSubject = new BehaviorSubject<IOauth2Error>(
                                    { isError: false,
                                      errorMessage: '',
                                    });
  private _oAuth2Error$ = this._oAuth2ErrorSubject.asObservable();
  private _oAuth2ErrorRedirectURLSubject = new BehaviorSubject<string>('');
  private _oAuth2ErrorRedirectURL$ = this._oAuth2ErrorRedirectURLSubject.asObservable();
  
  private _oAuth2ErrorRedirectURL = "/login";

  getOAuth2Error(): Observable<IOauth2Error> {
    return this._oAuth2Error$;
  }

  setOAuth2Error(errorValue: IOauth2Error): void {
    return this._oAuth2ErrorSubject.next(errorValue);
  }

  getOAuth2ErrorRedirectURL(): string {
    return this._cookieService.get("authFlow");
  }

  setOAuth2ErrorRedirectURL(url: string): void {
    this._cookieService.set("authFlow", url, 1, "/");
  }

  getUserDetails(): Observable<IUser> {
    return this._http.get(API_BASE_URL + "/user/me").pipe(map(response => response as IUser));
  }

  logout(): void {
    this._cookieService.delete("accessToken", "/");
  }

  login(loginPayload: ILogin): Observable<ILoginResponse> {
    return this._http.post(API_BASE_URL + "/auth/login", loginPayload).pipe(map(response => response as ILoginResponse));
  }

  signup(signUpPayload: ISignUp): Observable<IApiResponse> {
    return this._http.post(API_BASE_URL + "/auth/signup", signUpPayload).pipe(map(response => response as IApiResponse));
  }

  isUserLoggedIn(): boolean {
    if(this._cookieService.get("accessToken"))
      return true;
    return false;
  }

}
