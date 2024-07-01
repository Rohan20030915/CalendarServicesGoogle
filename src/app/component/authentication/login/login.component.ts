import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  
  
  constructor(private oauthService: OAuthService, private router: Router, private userServices: UserService) { }
  ngOnInit(): void {

    if (  this.token.length !=0){
      this.getTokenVerification();
    }

  
  }

     loginWithGoogle() {
    this.oauthService.initImplicitFlow();
  
    this.getTokenVerification();
  }


  
  token:string = this.userServices.getGoogleToken();
  async getTokenVerification() {
    const token = this.oauthService.getAccessToken();
    if (token.length>0||token != null || token != undefined || token != '') {
      localStorage.setItem('accessToken', token)
    }  
    if (this.token.length>10){
      
      this.userServices.login(this.token).subscribe((data: any) => {
        this.userServices.setToken(data.data.token)
        this.userServices.setUser(data.data.user)
        this.router.navigate(['/email'])
      })}
      else
      this.loginWithGoogle();
  }

  logout(): void {
    this.oauthService.logOut();
    localStorage.clear();
  }

  get tokenData(): string {
    return this.oauthService.getAccessToken();
  }

  // get userName(): string {
  //   const claims = this.oauthService.getIdentityClaims();
  //   localStorage.setItem('email', claims['email'])
  //   return claims ? claims['name'] : null;
  // }
}
