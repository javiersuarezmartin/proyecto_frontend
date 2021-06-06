import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { interval } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  formData:FormGroup;
  validationErrors = {
    hour_start:'',
    hour_end:'',
    interval:''
  };
  dateSelected;
  showConfig = false;
  datesAllDay;
  loading:boolean = true;
  msg_global = {
    text:'',
    type: false
  }

  msgConfig;
  msgConfigOk = null;

  constructor(private authService:AuthService, private dateService:DateService, private configService: ConfigService, private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.validateConfig();
    this.authService.checkToken();
    this.checkConfig();  
    this.checkConfigOk();  
    this.dateService.dateText.subscribe(
      res => {
        this.dateSelected = res; 
      },
      err => {
        console.log(err)
      }
    );

    this.dateService.showAllDatesDay.subscribe(
      res => {
        this.datesAllDay = res;
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
        console.log(err)
      }
    );

    this.configService.showConfig.subscribe(
      res => {
        this.msgConfig = res;
      },
      err => {
        console.log(err);
      }
    );
    
    this.configService.showConfigOk.subscribe(
      res => {
        this.msgConfigOk = res;
      },
      err => {
        console.log(err);
      }
    );
    this.setToday();
  }
  
  setToday() {
    this.dateService.setDate(moment().format('DD/MM/YYYY'));
    this.dateService.getAllDatesDayApi(moment().format('YYYYMMDD'));
  }

  checkConfig() {
    this.configService.getConfigApi().subscribe(
      res => {
        this.configService.clearErrConfig();
      },
      err => {
        if (err.status == 404) {
          this.configService.setErrConfig();
        } else {
          console.log('ERROR');
        }
      }
    )
  }

  checkConfigOk() {
    this.configService.getConfigApi().subscribe(
      res => {
        this.configService.setConfig(res);
        console.log(this.msgConfigOk);     
      },
      err => {
        console.log('No se han podido obtener los datos de configuración o no existen');
        console.log(err.error);
        this.msgConfigOk = {};
      }
    )
  }

  showConfigData() {
    this.resetErr();
    this.showConfig = !this.showConfig;
  }

  validateConfig() {
    this.formData = this.formBuilder.group ({
      hour_start : ['', Validators.required],
      hour_end : ['', Validators.required],
      interval : ['', [Validators.required, Validators.pattern('^[1-9]{1}[0-9]{0,2}$')]]      
    });
  }

  isTouchedField(field):boolean {
    if (this.formData.get(field).touched) {
      //console.log('Has tocado el campo' + field);
      return true;      
    } else {      
      return false;
    }
  }

  isEmptyField(field):boolean {
    if (this.formData.get(field).hasError('required')) {
      this.validationErrors[field] = 'Este campo no puede estar vacío';
      //console.log(this.validationErrors[field]);
      return true;
    } else {      
      //console.log(this.validationErrors[field]);
      return false;
    }
  }

  
  isValidInterval():boolean {
    if (this.formData.get('interval').hasError('pattern')) {
      this.validationErrors.interval = 'Sólo entre 1 y 999 min';
      //console.log(this.validationErrors[field]);
      return false;
    } else {      
      //console.log(this.validationErrors[field]);
      return true;
    }
  }
  
  isValidForm():boolean {
    if (!this.isEmptyField('hour_start') && !this.isEmptyField('hour_end') && !this.isEmptyField('interval')) {
      if(this.isValidInterval()) {
        return true;
      } else {
        return false;
      }        
    } else {
      return false;
    }    
  }

  saveConfig() {
    this.formData.markAllAsTouched();
    if(!this.isValidForm()) {      
      this.setMsgGlobal('Faltan datos o el intervalo es incorrecto', false);        
    } else {      
      if(this.checkHours(this.formData.value)) {
        console.log(this.formData.value);
        if(this.msgConfigOk.interval) {
          // Actualizar
          this.configService.updateConfigApi(this.formData.value).subscribe(
            res => {
              console.log(res);
              this.checkConfig();
              this.checkConfigOk();
              this.setMsgGlobal('Configuracion guardada con éxito', true);
              this.showConfig = false;
              this.clearValues();
            },
            err => {
              console.log(err);
              this.showConfig = false;
            }
          );
        } else {
          // Guardar config inicial
          this.configService.setConfigApi(this.formData.value).subscribe(
            res => {
              console.log(res);
              this.checkConfig();
              this.checkConfigOk();
              this.setMsgGlobal('Configuracion guardada con éxito', true);
              this.showConfig = false;
              this.clearValues();  
            },
            err => {
              console.log(err);
              this.showConfig = false;
            }
          );
        }        
      } else {
        this.setMsgGlobal('La hora inicial no puede ser mayor o igual que la hora final', false);
      }      
    }
  }

  checkHours(formData) {
    let hs = formData.hour_start.split(':');  
    let he = formData.hour_end.split(':');
    
    let hsText = '';
    let heText = '';
    for(let i=0; i < hs.length; i++) {
      hsText += hs[i]; 
    };

    for(let j=0; j < he.length; j++) {
      heText += he[j]; 
    };
   
    console.log(hsText);
    console.log(heText);

    if(parseInt(heText) <= parseInt(hsText)) {
      return false;
    } else {
      return true;
    }
  }

  resetErr() {
    this.setMsgGlobal('', false);     
  }

  clearValues() {
    this.formData.reset();
  }

  setMsgGlobal(text, type) {
    this.msg_global = {
      text:text,
      type:type
    };
  }
}
