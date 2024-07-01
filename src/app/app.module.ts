import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateTaskComponent } from './component/update-task/update-task.component';
import { UpdateEventComponent } from './component/update-event/update-event.component';
// import { AppDropDownComponent } from './component/app-drop-down/app-drop-down.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxColorsModule } from 'ngx-colors';
import { ColorPickerModule } from 'ngx-color-picker';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AddTaskComponent } from './component/add-task/add-task.component';
import { LoginComponent } from './component/authentication/login/login.component';
import { GoogleCalendarComponent } from './component/datalist/google-calendar/google-calendar.component';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';

import { ShowdataComponent } from './component/datalist/showdata/showdata.component';
// import { AddEventComponent } from './component/add-event/add-event.component';
// import { EventModelComponent } from './component/add-task/event-model/event-model.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { OAuthModule } from 'angular-oauth2-oidc';
import { authInterceptorProviders } from './utils/auth.interceptor';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  // clientId: '512735251582-0ev43lm1nnjn1ejqjv26b2bh5mbmiv07.apps.googleusercontent.com', // Replace with your client ID
  clientId: '854300695992-pa3tpgqqr4muoj787blsdo39amb7uvvp.apps.googleusercontent.com', // Replace with your client ID
  redirectUri: "http://localhost:4200/email",
  responseType: 'token id_token',
  scope: 'openid profile email https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.calendars https://www.googleapis.com/auth/calendar.settings.readonly',
  // scope: 'openid profile email https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send',
  strictDiscoveryDocumentValidation: false,
};



@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        GoogleCalendarComponent,
        ShowdataComponent,
        UpdateEventComponent,
        UpdateTaskComponent,
        AddTaskComponent
    ],
    providers: [
        provideAnimationsAsync(),
        authInterceptorProviders
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FullCalendarModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NgxColorsModule,
        ColorPickerModule,
        CKEditorModule,
        RouterModule.forRoot([]), // Ensure RouterModule is imported
        OAuthModule.forRoot()     // Ensure OAuthModule is imported
         
    ]
})
export class AppModule {

  // constructor(private oauthService: OAuthService) {
  //   this.oauthService.configure(authConfig);
  //   this.oauthService.tokenValidationHandler = new JwksValidationHandler();
  //   this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
  //     if (this.oauthService.hasValidAccessToken()) {
  //       // Handle post-login actions
  //     }
  //   });
  // }

  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        // Handle post-login actions
      }
    });
  }
 }
