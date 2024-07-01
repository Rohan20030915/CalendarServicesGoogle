import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateTaskComponent } from './component/update-task/update-task.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/authentication/login/login.component';
import { ShowdataComponent } from './component/datalist/showdata/showdata.component';

const routes: Routes = [
  

  {
    path: 'update-task/:taskId',
    component: UpdateTaskComponent,
    
  },
  // {
  //   path: 'app',
  //   component: AppComponent,
   
  // },

  // {
  //   path: 'list',
  //   component: ListComponent
  // },
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'email', component: ShowdataComponent, children: [
      // {
      //   path: '', component: ShowdataComponent
      // },
      // {
      //   path: 'content/:id',
      //   component: ContentComponent
      // }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
