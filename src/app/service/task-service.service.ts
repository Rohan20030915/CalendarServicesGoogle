import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import baseUrl from '../helper/help';
import { Task } from '../entity/Task';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {

  baseUrl = baseUrl+"/tasks";
 
  constructor(private http:HttpClient,private  userService:UserService) { }
  //Add Task
  public addTask(task:Task)
  {
    task.assignedBy=  '12';
    task.assignedTo=  '12';
    
    return this.http.post(`${this.baseUrl}/save`,task);
  }

  //get All Tasks
  public getAllTasks(userId:any)
  {
    
    // return this.http.get(`${baseUrl}/task/getAll`)
    return this.http.get(`${this.baseUrl}/getall/${userId}`)
  }

  public getAllTasksPagination(userId: any, startDate: any, endDate: any) {
    userId=  '12';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = {
      userId: userId,
      startDate: startDate,
      endDate: endDate,

    }; // Include your parameter here

    return this.http.get<any>(`${this.baseUrl}/getAll`, { headers, params });
    // return this.http.get(`${this.baseUrl}/getAll/${userId}`);
  }


   //get single Task
   public getSingleTaskById(id: any)
   {
     return this.http.get(`${this.baseUrl}/single/${id}`);
   }

    //Delete Tasks
    public deleteTask(id: any){
      console.log(id);
      return this.http.delete(`${this.baseUrl}/delete/${id}`);
    }

    //Update Task
    public updatetask(task:Task)
    {
      return this.http.put(`${this.baseUrl}/update`,task);
    }

   //change task color
   updateTaskColor(taskId: number, newColor: string){

    // alert(taskId);
    // alert(newColor);
    return this.http.put(`${this.baseUrl}/${taskId}/color`, { color: newColor });
  }


}
