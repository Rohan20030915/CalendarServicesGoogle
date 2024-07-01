import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: UserService,private router:Router) { }

  urls = ['https://www.wixapis.com/currency_converter/v1/currencies', ''];

  toAdd(authReq: any) {
    if (this.urls.includes(authReq.url))
      return false;
    return true;
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authReq = request;
    const token = this.authenticationService.getToken();

    if (token != null && this.toAdd(authReq)) {
      authReq = authReq.clone({
        setParams: { Authorization: `${token}` }
      });
    }
    console.log(authReq);


    return next.handle(authReq).pipe(catchError((error: any) => {
      let errorMsg = '';
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
      })

       if(error.status==401 || error.status==0){ 
    if(this.authenticationService.isTokenExpired()){
      Toast.fire({
        icon: 'error',
        title: 'Session Expired  !!'
      });
         localStorage.clear();
    }
    // }else
    //   Toast.fire({
    //     icon: 'error',
    //     title: 'You are  Unauthorized  !!'
    //   })
  
        //     localStorage.clear();
        //  this.router.navigate(['']);
        }
      
      console.log(error);
    return throwError(error);
    })
    )
  }
}
export const authInterceptorProviders = [{
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
},
]