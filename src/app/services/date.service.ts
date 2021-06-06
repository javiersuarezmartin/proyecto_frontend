import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private apiURL = 'http://localhost:8000/api/date/';
  private dateSQL = '';
  msgColor = new BehaviorSubject<object>({ text:'', type: false });

  date = new BehaviorSubject<string>('');
  dateFull = new BehaviorSubject<object>({});
  hours = new BehaviorSubject<Array<any>>([]);
  hourSelected = new BehaviorSubject<string>('');
  modal = new BehaviorSubject<boolean>(false);
  loading = new BehaviorSubject<boolean>(true);
  allDates = new BehaviorSubject<Array<any>>([]);
  allDatesDay = new BehaviorSubject<Array<any>>([]);
  errorHours = new BehaviorSubject<boolean>(false);
  
  constructor(private httpClient: HttpClient, private authService:AuthService, private configService: ConfigService) { }  

  get messageTextColor() {
    return this.msgColor.asObservable();
  }

  get dateText() {
    return this.date.asObservable();
  }

  get dateFullObject() {
    return this.dateFull.asObservable();
  }

  get hoursAvailable() {
    return this.hours.asObservable();
  }

  get hourText() {
    return this.hourSelected.asObservable();
  }

  get checkModal() {
    return this.modal.asObservable();
  }

  get showLoading() {
    return this.loading.asObservable();
  }

  get showAllDates() {
    this.getAllDatesApi();
    return this.allDates.asObservable();
  }

  get showAllDatesDay() {   
    return this.allDatesDay.asObservable();
  }

  get showErrorHours() {   
    return this.errorHours.asObservable();
  }


  setMsgColor(msg, color) {
    this.msgColor.next({text:msg, type: color});
  }

  cleanMsgColor() {
    this.msgColor.next({text:'', type: false});
  }

  setDate(dateSelected) {
    this.cleanDate(); /* SI SELECCIONAMOS UNA NUEVA FECHA LIMPIAMOS LA ANTERIOR */
    this.date.next(dateSelected);
  }

  cleanDate() {
    this.cleanHour(); /* SI CAMBIAMOS DE FECHA LIMPIAMOS LA HORA */
    this.date.next('');
  }

  setHour(hourSelected) {
    this.hourSelected.next(hourSelected);
  }

  cleanHour() {
    this.hourSelected.next('');
  }

  setDateFull(dateFullSelected) {
    this.dateFull.next(dateFullSelected);
    //console.log(this.dateFull.value);
  }

  cleanDateFull() {
    this.dateFull.next({});
  }

  setLoading() {
    this.loading.next(true);
  }

  cleanLoading() {
    this.loading.next(false);
  }

  getReservedHours (dateSQL) {
    this.dateSQL=dateSQL;
    this.hours.next([]); // Limpiamos las horas
    this.allDatesDay.next([]); // Limpiamos las citas que ve el admin.
    this.setLoading(); // Mostramos loader
    this.httpClient.get<Array<any>>(`${this.apiURL}reserved/${dateSQL}`, {headers:this.authService.getTokenHeader()}).subscribe (
      res => {    
        this.cleanLoading(); // Ocultamos loader
        console.log(res);
        this.getAvailableHours(this.formatReservedHours(res), dateSQL);
        this.getAllDatesDayApi(this.dateSQL); // Para el Admin, obtenemos las citas de ese dia.  
      },
      err => {
        console.log(err);
      }
    );
  }

  formatReservedHours(res):Array<string>{
    let cleanHours = [];
    for(let i=0; i < res.length; i++) {
      cleanHours.push(res[i].hour);
    }
    return cleanHours;
  }

  getAvailableHours(reservedHours, dateSQL) {
    this.errorHours.next(false);
    /* Reibimos valores de config de la API y obtenemos las horas disponibles */
    this.configService.getConfigApi().subscribe(
      res => {
        this.hours.next(this.formatConfigDateHour(res, dateSQL, reservedHours));        
      },
      err => {
        if(err.status = 404) {
          console.log('No existe configuración guardada');
          console.log(err);
          this.errorHours.next(true);
        } else {
          console.log('CUIDADO HAY OTRO ERROR');
          console.log(err);
        }       
      }
    );
  }

  refreshHours() {
    this.getReservedHours(this.dateSQL);
  }
 
  showModal() {
    this.modal.next(true);
  }

  hideModal() {
    this.modal.next(false);
  }
 
  confirmDate(data) { 
    console.log(this.authService.getTokenHeader());
    return this.httpClient.post(this.apiURL + 'add', data, {headers: this.authService.getTokenHeader()});
  }
  
  discardDateApi(id) {
    this.cleanMsgColor();    
    this.httpClient.delete(`${this.apiURL}delete/${id}`, {headers:this.authService.getTokenHeader()}).subscribe(
      res => {
        console.log(res);
        let aux = this.allDates.value;
        for (let i=0; i < aux.length; i++) {
          if (aux[i].id == id) {           
            aux.splice(i,1);
            this.setMsgColor('Cita eliminada correctamente', true);
          };
        };
      },
      err => {
        console.log(err);
      }
    );
  }

  validate() {
    if(this.date.value !='' && this.hourSelected.value !='') {
      return true;
    } else {
      return false;
    }
  }

  getAllDatesApi() {
    return this.httpClient.get<Array<any>>(this.apiURL + 'alldates', {headers: this.authService.getTokenHeader()}).subscribe(
      res => {
        console.log(res);
        this.allDates.next(this.formatDate(res));
      },
      err => {
        console.log(err);
        this.allDates.next([]);
      }
    );
  }

  getAllDatesDayApi(date) {
    this.setLoading(); // Mostramos loader
    this.httpClient.get<any>(`${this.apiURL}datesday/${date}`, {headers:this.authService.getTokenHeader()}).subscribe(
      res => {
        console.log(res);
        this.cleanLoading(); // Ocultamos loader
        this.allDatesDay.next(res);
      },
      err => {
        console.log('TENEMOS UN ERROR EN LAS CITAS DEL DIA O NO EXISTEN CITAS RESERVADAS ESTE DIA');
        console.log(err);
        this.cleanLoading(); // Ocultamos loader
        this.allDatesDay.next([]);
      }
    );
  }

  formatDate(dateArray):Array<any> {
    for(let i=0; i < dateArray.length; i++) {
      let aux = moment(dateArray[i].date, "YYYY-MM-DD");      
      dateArray[i].date = aux.format('DD-MM-YYYY');
    };    
    return dateArray;
  }

  formatConfigDateHour(dateObject, dateSQL, reservedHours) {    
    let initialString = dateSQL.toString() + ' ' + dateObject.hour_start.toString();
    let endString = dateSQL.toString() + ' ' + dateObject.hour_end.toString(); 
    let initialMoment = moment(initialString, 'YYYYMMDD HH:mm:ss');
    let endMoment = moment(endString, 'YYYYMMDD HH:mm:ss');
    //console.log(initialMoment.format('DD-MM-YYYY HH:mm'));
    //console.log(endMoment.format('DD-MM-YYYY HH:mm'));
    let hoursAux = []; 
    while (initialMoment < endMoment) {
      //console.log(initialMoment.format('DD-MM-YYYY HH:mm'));
      let objectHour = {
        hour: initialMoment.format('HH:mm'),
        disabled: reservedHours.includes(initialMoment.format('HH:mm:ss')),
        active: false
      }
      hoursAux.push(objectHour);
      initialMoment.add(dateObject.interval, 'm');      
    };
    console.log(hoursAux);  
    return hoursAux;    
  }

  clearAllDates() {    
    this.allDates.next([]);
  }
}
