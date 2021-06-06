import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private apiURL = 'http://localhost:8000/api/config/';
  msgConfig = new BehaviorSubject<object>({text:'', status: false});
  msgConfigOk = new BehaviorSubject<object>({});

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  get showConfig() {
    return this.msgConfig.asObservable();
  }

  get showConfigOk() {
    return this.msgConfigOk.asObservable();
  }

  setConfigApi(formData) {
    return this.httpClient.post(this.apiURL + 'setconfig', formData, {headers: this.authService.getTokenHeader()})
  }

  getConfigApi() {
    return this.httpClient.get(this.apiURL + 'getconfig', {headers: this.authService.getTokenHeader()});
  }

  updateConfigApi(formData) {
    return this.httpClient.put(this.apiURL + 'updateconfig', formData, {headers: this.authService.getTokenHeader()});
  }

  setConfig(configData) {  
    this.msgConfigOk.next(configData);
  }

  setErrConfig() {  
    this.msgConfig.next({text:'IMPORTANTE: No se ha completado la configuración inicial', status: false});
  }

  clearErrConfig() {
    this.msgConfig.next({text:'La aplicación se encuentra correctamente configurada', status: true});
  }

}
