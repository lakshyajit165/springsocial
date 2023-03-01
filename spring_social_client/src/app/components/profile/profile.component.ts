import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { IUser } from 'src/app/model/IUser';
import { AuthService } from 'src/app/services/auth.service';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._authService.getUserDetails().subscribe({
      next: (data: IUser) => {
        this.name = data.name;
        this.imageUrl = data.imageUrl;
      },
      error: err => {
        console.log(err);
      }
    })
  }

  public name: string = "";
  public imageUrl: string = "";
  faSignOut = faSignOut;

  logout(): void {
    this._authService.logout();
    this._router.navigate(["/login"]);
  }

}
