import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  
  currentDate = moment();
  nameCurrentMonth ='';
  nameCurrentYear = '';

  monthSelect = [];
  weekDays:any = [];  
  
  selectedDate:any;
  selectedDateText:any;
  posDay:number = -1;   

  constructor(private dateService:DateService) { 
    moment.locale('es');
    this.weekDays = moment.weekdays(true);

    this.dateService.dateText.subscribe(
      res => {
        this.selectedDateText = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {
    this.getDaysMonth(this.currentDate.month(), this.currentDate.year());
    console.log(this.monthSelect);
  }

  // DIAS DEL MES
  getDaysMonth (month, year) {
    this.posDay = -1;
    let actual = moment().set({'year':year, 'month':month});
    let firstDayMonth = actual.startOf('month').weekday();    
    let daysOfMonth =  actual.daysInMonth();
    this.nameCurrentMonth = actual.format('MMMM');
    this.nameCurrentYear = actual.format('YYYY');
    
    // Llenamos los dias del mes.
    let array = [];
    let day = 0;
    let theDay = {};
    for(let i=0; i<daysOfMonth+firstDayMonth; i++) { 
      if (i<firstDayMonth) {
        theDay = {
          day: '',
          month: month,
          year: year,
          dayOfWeek: '',
          active: false, 
          disabled: true
        }
      } else {  
        day++;      
        theDay = {
          day: day,
          month: month,
          year: year,
          dayOfWeek: moment().set({'year':year, 'month':month, 'date':day}).day(),
          active: false, 
          disabled: this.checkDisabled(moment().set({'year':year, 'month':month, 'date':day}))
        };
      };      
      array.push(theDay);
    };
    this.monthSelect = array;    
  }
  
  checkDisabled(date):boolean {    
    let today = moment();
    if (date < today) {
      return true;
    } else {
      return false;
    };     
  } 

  backMonth() {
    this.dateService.cleanDate(); // Limpiamos la fecha al cambiar de mes.
    this.currentDate = this.currentDate.subtract(1, 'month');
    this.getDaysMonth(this.currentDate.get('month'), this.currentDate.get('year'));
    console.log(this.monthSelect);
  }

  nextMonth() {
    this.dateService.cleanDate(); // Limpiamos la fecha al cambiar de mes.
    this.currentDate = this.currentDate.add(1, 'month');
    this.getDaysMonth(this.currentDate.get('month'), this.currentDate.get('year'));
    console.log(this.monthSelect);
  }

  getPosSelected(selectedDate):number { 
    let selectedDay = selectedDate.get('D');
    let firstDayMonth = selectedDate.startOf('month').weekday();
    this.posDay = selectedDay + firstDayMonth - 1;
    console.log ('La posicion es ' + this.posDay);
    return this.posDay;
  }
  
  getDay(day, month, year, disabled) {
    this.dateService.cleanMsgColor(); // Limpiamos el mensaje de error en caso de que exista.
    if (disabled) {
      this.dateService.setMsgColor('La fecha seleccionada no es válida', false);// Mostramos el error.
      this.dateService.cleanDate(); // Limpiamos la fecha por no ser válida.
      this.dateService.cleanDateFull(); // Limpiamos la fecha FULL por no ser válida.
      setTimeout(() => {this.dateService.cleanMsgColor()}, 8000); 
    } else {
      this.selectedDate = moment().set({'year':year, 'month':month, 'date':day});
      this.dateService.setDateFull(this.selectedDate);     
      this.dateService.setDate(this.selectedDate.format('DD/MM/YYYY'));
      console.log(this.selectedDateText);
      this.dateService.getReservedHours(this.selectedDate.format('YYYYMMDD')); 

      // Cambiamos estilo de fondo para saber que dia está seleccionado.
      if(this.posDay != -1){
        this.monthSelect[this.posDay].active = false; //Para limpiar el anterior.
      }
      this.monthSelect[this.getPosSelected(this.selectedDate)].active = true;

    /* OPCIONAL   
      this.selectedDate = moment().set({'date':day, 'month':month, 'year':year}).format('DD/MM/YYYY');
      this.selectedDateMySQL = moment().set({'date':day, 'month':month, 'year':year}).format('YYYY-MM-DD');
      this.selectedWeekDay = moment().set({'date':day, 'month':month, 'year':year}).format('dddd'); 
      console.log(this.selectedDate);
    */
      if(screen.width < 500) {
        setTimeout(() => {this.moveWindow(400)}, 500);
      }      
    }
  } 

  moveWindow(pixels) {
    window.scroll({
      top: pixels,
      left: 0,
      behavior: 'smooth'
    });
  }
}