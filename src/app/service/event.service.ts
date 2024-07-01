import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Event } from '../entity/Event';
import baseUrl from '../helper/help';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  timeForm: FormGroup;

  baseUrl = baseUrl + "/events";


  constructor(private fb: FormBuilder, private http: HttpClient, private userService: UserService) {
    this.timeForm = this.fb.group({
      startTime: ['']
    });
  }

 //add event
 public addEvent(event:Event)
 {
   const time = this.timeForm.value.startTime;
       event.assignedBy = '12'
   const formattedTime = time.length === 5 ? `${time}:00` : time;
   const token =this.userService.getGoogleToken();
   const tokenData = "Bearer "+token+" "+"helo"

   return this.http.post(`${baseUrl}/events/save?MeetingToken=${tokenData}`, event);

   // return this.http.post(`${baseUrl}/event/save`,event);
 }


  //get all events
  public getAllEvents(userId: any) {
    return this.http.get(`${this.baseUrl}/getAll/${userId}`);
  }

  //get all events
  public getAllEventsPagination(userId: any, startDate: any, endDate: any) {
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


  //Delete Tasks
  public deleteEvent(id: any) {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

  //get single Event
  public getSingleEventById(id: any) {
    return this.http.get(`${this.baseUrl}/single/${id}`);
  }

  //Update Event
  public updateEvent(event: Event) {
    event.assignedBy = '12'
const token =this.userService.getGoogleToken();
const tokenData = "Bearer "+token+" "+"helo"

    return this.http.put(`${this.baseUrl}/update?MeetingToken=${tokenData}`, event);
  }

  //change event color
  //change task color
  updateEventColor(eventId: number, newColor: string) {

    //alert(eventId);
    // alert(newColor);
    return this.http.put(`${this.baseUrl}/${eventId}/color`, { color: newColor });
  }
}
