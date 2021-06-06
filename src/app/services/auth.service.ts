import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = 'http://localhost:8000/api/auth/';
  private loggedIn = new BehaviorSubject<boolean>(false);
  private error = new BehaviorSubject<string>('');
  private user = new BehaviorSubject<any>({});

  constructor(private httpClient: HttpClient, private router: Router) {}

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get existError() {
    return this.error.asObservable();
  }

  get userData() {
    return this.user.asObservable();
  }
  
  loginApi(formData){
    this.httpClient.post<any>(this.apiURL + 'login', formData).subscribe(
      res => {
        console.log(res);
        this.user.next(res.data);
        console.log(this.user);
        localStorage.setItem('token', res.token);
        this.loggedIn.next(true);
        this.error.next('');
        this.router.navigate(['/user']);
      },
      err => {
        if(err.status == 401) {
          this.error.next('Usuario o contraseña incorrectos');
        }
        console.log(err);
      }
    );      
  }
  
  logoutApi() {
    this.httpClient.get<any>(this.apiURL + 'logout', {headers: this.getTokenHeader()}).subscribe(
      res => {      
        localStorage.removeItem('token');
        this.user.next({});
        this.loggedIn.next(false);
        this.error.next('');
        this.router.navigate(['/login']);
      },
      err => {
        this.error.next('El usuario no está logado');
        console.log(err);
      }
    );    
  }

  registerApi(formData) {    
    this.httpClient.post<any>(this.apiURL + 'register', formData).subscribe(
      res => {
        console.log(res);
        localStorage.setItem('token', res.token);
        this.loggedIn.next(true);
        this.error.next('');
        this.router.navigate(['/user']); 
      },
      err => {
        if(err.status == 409) {
          this.error.next('El usuario ya existe');
        } else {
          if(err.status == 403)
          this.error.next('Ya existe un administrador');
        };        
        console.log(err);
      }
    );
  }

  checkToken():boolean {
    if(localStorage.getItem('token')) {
      this.loggedIn.next(true);
      return true;      
    } else {
      this.loggedIn.next(false);
      return false;
    }
  }

  refreshUser() {
    this.getUserByToken().subscribe(
      res=> {
        //console.log(res.data);
        this.user.next(res.data);
        return res.data;
      },
      err => {
        console.log(err);
        this.user.next({});
      }
    );
  }

  isAdmin() {
    //console.log(this.user.value);
    if (this.loggedIn.value) {
      if(this.user.value.role == 1) {
        console.log('El usuario es ADMIN');
        return true;
      } else {
        console.log('El usuario no es ADMIN');
        return false;
      };
    } else {
      console.log('No hay usuario logado');
      return false;
    };
  }

  getUserByToken() {   
    return this.httpClient.get<any>(this.apiURL + 'user', {headers: this.getTokenHeader()});
  }

  getTokenHeader() {
    const headers = new HttpHeaders ({
      'Authorization' : `Bearer ${localStorage.getItem('token')}`,
      'content-type' : 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return headers;
  }

  clearError() {
    this.error.next('');
  }
}
