import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  allDates;

  constructor(private dateService:DateService, private authService: AuthService) { }

  ngOnInit(): void {
    this.dateService.clearAllDates();
    this.authService.checkToken();
    this.authService.refreshUser();
    this.dateService.showAllDates.subscribe(
      res => {
        this.allDates = res;
        console.log(this.allDates);
      },
      err => {
        console.log(err);
      }
    );
    this.dateService.cleanDate();
  }

  discardDate(id) {
    console.log (id);
    this.dateService.discardDateApi(id);
  }

  getDate(date) {
    console.log(date);    
  }
}
