import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from '../helper/help';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = baseUrl+"/api/v1/auth";
  constructor(private httpClient: HttpClient) { }



  login(token: any) {
    const tokenData = "Bearer "+token+" "+"helo"

    return this.httpClient.post(`${this.baseUrl}/signInGoogle?GoogleToken=${tokenData}`, {});


  }

    // getting current login user
  getCurrentUser(){
     return this.httpClient.get(`${this.baseUrl}/current-user`);
  }

   // fetching is user logged in
  isLoggedIn(){
    let token =this.getToken();
    if(token!=null)
    return true;
  return false;
  }

  // get token from local Storage
  getToken(){
    let token=localStorage.getItem("token");
    if(token==undefined || token.length<1)
    return null;
   return token;
 }

   // get token from local Storage
   getGoogleToken():string{
    let token=localStorage.getItem("accessToken");
    if(token==null || token.length<1)
    return '';
   return token;
 }


 // getting user from local storage
 getUser(){
   let user=localStorage.getItem("user");
   if(user==undefined)
   return null;
 return JSON.parse(user);
 }

// setting user to local storage
setUser(user:any){
  localStorage.setItem("user",JSON.stringify(user));
}

// setting token to local storage
setToken(token:string){
  localStorage.setItem("token",token);
}



  isTokenExpired(){
   let token= this.getToken();
   if(token!=null)
   {
   const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
   return (Math.floor((new Date).getTime() / 1000)) >= expiry;
   }
   return false;
  }


}