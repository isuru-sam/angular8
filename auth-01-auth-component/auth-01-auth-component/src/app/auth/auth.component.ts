import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
isLoginMode=true;

constructor(private authService:AuthService,private router:Router){

}
onSwitchMode(){
  this.isLoginMode=!this.isLoginMode;
}

onSubmit(form:NgForm){
  console.log(form.value);
  const email=form.value.email;
  const password =form.value.password;
  let authObservable:Observable<AuthResponseData>;
  if(this.isLoginMode){
    
    authObservable=this.authService.login(email,password);
  
  } else {
    authObservable=this.authService.signup(email,password);
  }

authObservable.subscribe(resData=>{
  console.log(resData);
  this.router.navigate(['/recipes']);
  
  },error=>{console.log(error)});
  
  form.reset();
}

}
