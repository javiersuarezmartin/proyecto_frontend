import { Component, OnInit } from '@angular/core';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-hour',
  templateUrl: './hour.component.html',
  styleUrls: ['./hour.component.css']
})
export class HourComponent implements OnInit {

  hours = [];
  date:any;
  selectedHour;
  loading = true;
  errorHours = false;

  constructor(private dateService:DateService) { }

  ngOnInit(): void {
    this.dateService.dateText.subscribe(
      res => {
        this.date = res;
      },
      err => {
        console.log(err);
      }
    );
    
    this.dateService.hoursAvailable.subscribe(
      res => {
        this.hours = res;
      },
      err => {
        console.log(err);
      }
    );

    this.dateService.showLoading.subscribe(
      res => {
        this.loading = res;
      },
      err => {
        console.log(err);
      }
      
    ); 
    
    this.dateService.showErrorHours.subscribe(
      res => {
        this.errorHours = res;
      },
      err => {
        console.log(err);
      }      
    ); 
  }

  selectHour(hour:string) {
    /* LIMPIAMOS DATOS */
    this.clearData();

    /* COMPROBAMOS QUE LA HORA ES VÁLIDA Y LA ALMACENAMOS */
    if (this.validHour(hour)) {    
      this.selectedHour = hour;
      console.log(this.selectedHour);
      this.dateService.setHour(this.selectedHour);

      /* CAMBIAMOS LA PROPIEDAD ACTIVE DE LA HORA SELECCIONADA PARA CAMBIAR EL COLOR DE FONDO */
      for (let i=0; i<this.hours.length; i++) {
        if (this.hours[i].hour == hour) {
          this.hours[i].active = true;
        } else {
          this.hours[i].active = false;
        }
      };
    } else {
      /* LA FECHA NO ES VÁLIDA POR TANTO MOSTRAMOS MENSAJE ERROR */
      console.log('La hora seleccionada no está disponible');
      this.dateService.setMsgColor('La hora seleccionada no está disponible', false);
      setTimeout(() => {this.dateService.cleanMsgColor()}, 8000);
    }
  }

  validHour(hour):boolean {
    for (let i=0; i<this.hours.length; i++) {
      if (this.hours[i].hour == hour) {
        if(this.hours[i].disabled == true) {
          return false;
        } else {
          return true;
        };
      };
    };
  }

  showModalConfirm() {
    this.moveWindow(0);
    if (this.dateService.validate()) {
      this.dateService.showModal();
    } else {
      this.dateService.setMsgColor('Faltan datos. Debe seleccionar una fecha y una hora', false);
      setTimeout(() => {this.dateService.cleanMsgColor()}, 8000);
    };    
  }

  clearData() {
    this.dateService.cleanHour();
    this.dateService.cleanMsgColor();
    for (let i=0; i<this.hours.length; i++) {
      this.hours[i].active = false;
    };
  }

  moveWindow(pixels) {
    window.scroll({
      top: pixels,
      left: 0,
      behavior: 'smooth'
    });
  }
}