import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Token } from '@angular/compiler';


export interface AuthResponseData {
    kind:string,
    idToken:string,
    email:string,
    refreshToken:string,
    expiresIn:string,
    localId:string,
    registered?:boolean
}
@Injectable(
    {
        providedIn:'root'
    }
)
export class  AuthService {
user=new BehaviorSubject<User>(null);
private tokenExpirationTimer:any;
token:string=null;
    constructor(private http:HttpClient){

    }
signup(email:string,password:string){
return this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBTJ3ktYTD3M6bnOuCkuL65dmAvTxE5wIs",
{email:email,password:password,returnSecureToken:true}).pipe(
    catchError(
        this.handleError
    ),tap(resData=>{
        const expiratioNDate= new Date(new Date().getTime()+(+resData.expiresIn)*1000);
const user =new User(resData.email,resData.localId,resData.idToken,expiratioNDate);
this.user.next(user);

    }));







}

login(email:string,password:string){
 return   this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBTJ3ktYTD3M6bnOuCkuL65dmAvTxE5wIs",
    {email:email,password:password,returnSecureToken:true}
    ).pipe(
        catchError(
            this.handleError
        ),tap(resData=>{
            const expiratioNDate= new Date(new Date().getTime()+(+resData.expiresIn)*1000);
    const user =new User(resData.email,resData.localId,resData.idToken,expiratioNDate);
    this.user.next(user);
    localStorage.setItem("userData",JSON.stringify(user));
    this.autoLogout(+resData.expiresIn*1000);
        }));

    }
private handleError(errorRes:HttpErrorResponse) {
    let errorMsssage="Unknown ErrorOcccured";
    switch(errorRes.message) {
        case '401':
                errorMsssage='Forbid';
    }
         return   throwError(errorMsssage);
}


logout() {
    this.user.next(null);
    localStorage.removeItem("userData");
    if(this.tokenExpirationTimer) {
        clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer=null;
}


autoLogin() {
    const userData:{email:string,id:string,_token:string,_tokenExpiratonDate:string} = JSON.parse(localStorage.getItem("userData"));
    if(!userData){
        return;
    }

    const userloaded = new User(userData.email,userData.id,userData._token,new Date(userData._tokenExpiratonDate));
if(userloaded.getToken()) {
this.user.next(userloaded);
const expirationDuration = new Date(userData._tokenExpiratonDate).getTime()-new Date().getTime();
this.autoLogout(expirationDuration);
}

}

autoLogout(expirationDuration:number){
    this.tokenExpirationTimer  = setTimeout(()=>{this.logout()},expirationDuration);
}
}