import { Component, OnInit } from '@angular/core';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.css']
})
export class DateSelectorComponent implements OnInit {

  msgColor;
  dateSelected;
  showModal;

  constructor(private dateService:DateService) { }

  ngOnInit(): void {
  
    this.dateService.dateText.subscribe(
      res => {
        this.dateSelected = res;
      },
      err => {
        console.log(err);
      }
    );

    this.dateService.checkModal.subscribe(
      res => {
        this.showModal = res;
      },
      err => {
        console.log(err);
      }      
    );
    
    this.dateService.messageTextColor.subscribe(
      res => {
        this.msgColor = res;
      },
      err => {
        console.log(err);
      }      
    );
  }

  closeMsgColor() {
    this.dateService.cleanMsgColor();
  }
}
