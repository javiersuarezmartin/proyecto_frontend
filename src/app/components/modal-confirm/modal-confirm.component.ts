import { Component, OnInit } from '@angular/core';
import { Cite } from 'src/app/models/cite';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.css']
})
export class ModalConfirmComponent implements OnInit {

  selectedDate = '';
  selectedWeekDay = '';
  selectedHour = '';

  constructor(private dateService: DateService) { }

  ngOnInit(): void {
    this.dateService.date.subscribe(
      res => {
        this.selectedDate = res;
      },
      err => {
        console.log(err);
      }
    );

    this.dateService.hourSelected.subscribe(
      res => {
        this.selectedHour = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  confirmCite() {
    let dateObject:Cite = {
      date: this.transformDateSQL(),
      hour:this.selectedHour
    } 
    this.dateService.confirmDate(dateObject).subscribe(
      res => {
        this.dateService.setMsgColor('Su cita ha sido confirmada', true);
        this.dateService.getAllDatesApi();
        this.dateService.hideModal();
        this.dateService.cleanHour();
        this.dateService.cleanDate();
        console.log(res);
      },
      err => {
        console.log(err);
        // Comprobamos si es error duplicado y mostramos el mensaje.
        if (err.status == 409) {
          this.dateService.setMsgColor(err.error , false);
          this.dateService.hideModal();
          console.log(this.selectedDate);
          this.dateService.refreshHours();
        }
      }
    );
  }

  transformDateSQL() {
    let dateSplit = this.selectedDate.split('/');
    let dateReverse = dateSplit.reverse();
    let dateSQL = '';
    for(let i=0; i<dateReverse.length; i++) {
      dateSQL = dateSQL + dateReverse[i];
    };
    console.log(dateSQL);
    return dateSQL;
  }

  discardCite() {
    this.dateService.hideModal();
  }
}
