import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
    
  textoBoton:string = "";
  showRegData:boolean = false;
  formData:FormGroup;
  validationErrors = {
    name:"",
    email:"",
    password:"",
    passwordcheck:""
  };
  errorPass:string = "";
  errorLogin;

  constructor(private router:Router, private formBuilder:FormBuilder, private authService:AuthService) { }

  ngOnInit(): void {
    this.regOrLog();
    this.authService.clearError();
    this.authService.existError.subscribe(
      res => {
        this.errorLogin = res;
      },
      err => {
        console.log(err);
      }
    ) 
  }
 
  regOrLog() {    
    if (this.router.url == '/register') {
      this.textoBoton = 'Registro';
      this.showRegData = true;
      this.formData = this.formBuilder.group ({
        name : ['', Validators.required],
        email : ['', [Validators.required, Validators.email]],
        password : ['', [Validators.required, Validators.minLength(8)]],
        passwordcheck : ['', Validators.required],
        role: 0
      }); 
    } else if (this.router.url == '/login') {
      this.textoBoton = 'Login'; 
      this.showRegData = false; 
      this.formData = this.formBuilder.group ({
        email : ['', [Validators.required, Validators.email]],
        password : ['', Validators.required]
      });  
    };
  }

  loginOrRegister() {  
    //Comprobamos primero si todos los campos estan correctos.  
    if (!this.isValidForm()) {
      this.formData.markAllAsTouched();
      console.log('Datos incompletos');
    } else {      
      if (this.router.url == '/register') {
        // Comprobamos si las password coinciden.
        if(!this.checkPassword()){        
          this.errorPass = "La password no coincide";             
        } else {
          this.resetErr();
          this.register();
        };
      } else if (this.router.url == '/login') {
        this.login();
      };         
    }; 
  }

  login() {
    console.log(this.formData.value);
    console.log('LOGIN');
    this.authService.loginApi(this.formData.value);    
  }

  register() {               
    console.log(this.formData.value);
    console.log('REGISTER');
    this.authService.registerApi(this.formData.value);        
  }

  isTouchedField(field):boolean {
    if (this.formData.get(field).touched) {
      return true;
    } else {      
      return false;
    }
  }

  isEmptyField(field):boolean {
    if (this.formData.get(field).hasError('required')) {
      this.validationErrors[field]= "Este campo no puede estar vacío";
      return true;
    } else {      
      return false;
    }
  }

  isValidEmail():boolean { 
    if(this.isEmptyField('email')) {
      return false;      
    } else {
      if(this.formData.get('email').hasError('email')) {
        this.validationErrors['email']= "El e-mail no es válido";
        return false;
      }
      return true;
    }
  }

  isValidPassword():boolean { 
    if(this.isEmptyField('password')) {
      return false;      
    } else {
      if(this.formData.get('password').hasError('minlength')) {
        this.validationErrors['password']= "Debe tener mínimo 8 caracteres";
        return false;
      }
      return true;
    }
  }

  isValidForm():boolean {
    if (this.router.url == '/register') {
      if (!this.isEmptyField('name') && this.isValidEmail() && this.isValidPassword()) {
        return true;      
      } else {
        return false;
      }
    } else if (this.router.url == '/login') {
      if (this.isValidEmail() && this.isValidPassword()) {
        return true;      
      } else {
        return false;
      }
    }
  }

  checkPassword():boolean {
    if(this.formData.get('password').value == this.formData.get('passwordcheck').value) {
      return true;
    } else { 
      return false;
    }
  }

  resetErr() {
    this.errorPass="";
    this.errorLogin="";
  }
  
  clearFormData() {
    this.formData.reset();
  }
}

