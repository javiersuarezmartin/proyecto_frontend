import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private authService:AuthService, private router:Router) { }

  ngOnInit(): void {
    this.authService.checkToken();
  }

  registerAdmin() {
    this.router.navigate(['register']);
  }

  /* Para activar el registro del admin la primera vez */

  setFlagAdmin() {
    //this.authService.setFlagAdminApi();
  }

}
