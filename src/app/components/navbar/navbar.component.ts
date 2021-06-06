import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],  
})
export class NavbarComponent implements OnInit {

  isLoggedIn: boolean = false;
  user: any;
  username: string = "";
  role: number = 0; // Admin si es 1

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe(
      res => {
        console.log(res);
        this.isLoggedIn = res;
        if (this.isLoggedIn) {
          this.getUserData();
        };
      },
      err => {
        console.log(err);
      }
    );
  }

  logout() {
    this.authService.logoutApi();
    this.username = "";
  }

  getUserData() {
    this.authService.getUserByToken().subscribe (
      res => {
        //console.log(res);
        this.user = res;
        this.username = this.user.data.email;
        this.role = this.user.data.role;
      },
      err => {
        console.log(err);
      }
    );
  }
}
