import { ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Task } from '../../../entity/Task';
import { Event } from '../../../entity/Event';
import Toast from '../../../helper/notifiction';
import { EventService } from '../../../service/event.service';
import { TaskServiceService } from '../../../service/task-service.service';
import { UserService } from '../../../service/user.service';
import { Token } from '@angular/compiler';
import { en } from '@fullcalendar/core/internal-common';
import { OAuthService } from 'angular-oauth2-oidc';
import { AppUtils } from '../AppUtils ';


@Component({
  selector: 'app-google-calendar',
  templateUrl: './google-calendar.component.html',
  styleUrl: './google-calendar.component.css'
})
export class GoogleCalendarComponent implements OnInit {
  [x: string]: any;

  task: Task = new Task();
  event: Event = new Event();
  tasks: Task[] = [];
  events: Event[] = [];
  public Editor = ClassicEditor;
  notificationTime: number = 1;
  notificationUnit: string = 'days';

  constructor(private taskService: TaskServiceService, private eventService: EventService, private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.initializeForm();

  }
  userId: any = 0;
  ngOnInit(): void {

    // this.getUserId();

  }



  getUserId() {
    // const accessToken = this.userService.getGoogleToken();
    // if (accessToken.length>0) {
    //   this.userService.login(accessToken).subscribe((data: any) => {
    //     this.userService.setToken(data.data.token)
    //     this.userService.setUser(data.data.user)

    //     this.userId = data.data.user.id;

    //   }, (err: any) => {
    //     console.log('error occured '+err);
    //   })
    // }

    const { startDate, endDate } = this.getCurrentMonthDateRange();
    AppUtils.setDates(startDate, endDate)
    this.loadAllTasksAndEvents();

  }

  selectedTab = 'tasks'
  selectTab(selectedTabNow: any) {
    if (this.selectedTab != selectedTabNow) {
      this.selectedTab = selectedTabNow
    }
  }

  taskDetailClass: string = "content hidetab";
  calenderClass: string = 'content white_card_background p-4'
  filters: string = "Month";

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
    dateClick: this.handleDateClick.bind(this),
    select: this.handleDateRangeSelect.bind(this),
    selectable: true,
    eventClick: this.handleEventClick.bind(this),

    eventColor: 'green',
    events: [this.events],
    height: 'auto',
    contentHeight: 'auto',
    expandRows: true,
    headerToolbar: {
      start: 'title customButton4 customButton3', // Place the title on the left side
      center: '',
      end: 'customDropdown prev,today,next customButton1 customButton2'
    },
    customButtons: {
      customButton1: {
        text: 'Calender', // Set the name for custom button 1
        click: () => {

          console.log('Custom Button 1 clicked');
        }
      },
      customButton2: {
        text: 'Task & Event',
        click: () => {
          // Define the action for custom button 2
          this.calenderClass = 'content white_card_background p-4 hidetab'
          this.taskDetailClass = 'content'
          console.log('Custom Button 2 clicked');

        }
      },
      customButton3: {
        text: '+ Add',
        click: () => {
          this.openModal();

          // Define the action for custom button 3
        }
      },
      customButton4: {
        text: '',
        click: () => {
          // No action needed
        }
      },

      customDropdown: {
        //icon: 'fa fa-caret-down',
        text: '',
        click: (info) => {

          this.toggleDropdown();
        }
      },
    },
    // titleFormat: { // This is where you define the format
    //   month: 'long' // This will show the full month name only
    // },
    datesSet: this.handleDatesSet.bind(this), // Handle date range changes
  };


  getCurrentMonthDateRange() {
    const start = new Date();
    start.setDate(1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  }


  handleDatesSet(arg: any) {
    const startDate = arg.startStr.split('T')[0];
    const endDate = arg.endStr.split('T')[0];
    AppUtils.setDates(startDate, endDate);

    this.loadAllTasksAndEvents();
    setTimeout(() => {
    
      this.setupminiCalendar();

      this.setupCustomDropdown();
    }, 0); // Delay to ensure the DOM is updated after FullCalendar renders

  }


  setupminiCalendar() {
    const customButton4 = document.querySelector('.fc-customButton4-button');
    if (customButton4) {
      // Clear default styles
      customButton4.classList.remove('fc-button', 'fc-button-primary');
      customButton4.innerHTML = `
      <div style="position: relative; display: inline-block;" >
      <input type="date" id="datePicker" style="position: absolute; top: 0; left: 0; height: 100%; width: 100%; opacity: 0; cursor: pointer;">
  <img src="assets/images/svg-img/calender.svg" style="height:30px; width:30px; cursor: pointer;">
</div>
`;

      const datePicker = document.getElementById('datePicker') as HTMLInputElement;

      if (datePicker) {
        customButton4.addEventListener('click', () => {
          datePicker.click();
        });

        datePicker.addEventListener('change', (event: any) => {
          const selectedDate = (event.target as HTMLInputElement).value;
          console.log('Selected Date:', selectedDate);
          this.changeView('timeGridDay', 'Day', selectedDate);
        });
      }
    }

  }


  setupCustomDropdown() {
    // Replace innerHTML for customDropdown button
    const customDropdownButton = document.querySelector('.fc-customDropdown-button');
    if (customDropdownButton) {
      customDropdownButton.innerHTML = `
        <div class="calendar-container">
          <div class="dropdown">
           <label>  ${this.filters}  ${this.dropdownOpen ? 'v' : 'v'} </label>
            <div class="dropdown-menu ${this.dropdownOpen ? 'show' : ''}" aria-labelledby="dropdownMenuButton">
              <button class="dropdown-item" data-view="dayGridMonth">Month</button>
              <button class="dropdown-item" data-view="timeGridWeek">Week</button>
              <button class="dropdown-item" data-view="timeGridDay">Day</button>
            </div>
          </div>
        </div>
      `;
      this.addDropdownEventListeners();
    }
  }

  addDropdownEventListeners() {
    const dropdownMenuButton = document.getElementById('dropdownMenuButton');
    if (dropdownMenuButton) {
      dropdownMenuButton.addEventListener('click', () => this.toggleDropdown());
    }
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach((item) => {

      item.addEventListener('click', (event: any) => {
        const target = event.target as HTMLElement;
        const viewType = target.getAttribute('data-view');
        const buttonText = target.textContent || '';
        if (viewType) {
          this.changeView(viewType, buttonText);
        }
      });
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    this.cdr.detectChanges(); // Ensure Angular change detection is triggered
    this.setupCustomDropdown(); // Re-setup dropdown to reflect the new state
  }


  handleDateClick(arg: any) {
    this.event.patchValue({ startDate: arg.dateStr, endDate: arg.dateStr });
    this.task.patchValue({ startDate: arg.dateStr, endDate: arg.dateStr });
    this.openModal();
  }
  handleDateRangeSelect(arg: any) {
    if (arg.startStr && arg.endStr) {
      const startDate = new Date(arg.startStr);
      let endDate:any = new Date(arg.endStr);
      // Subtract one day from the end date to exclude the extra date
      endDate.setDate(endDate.getDate()  -1);
      endDate=''+endDate.toISOString().split('T')[0]

      this.task.patchValue({ startDate: arg.startStr, endDate: endDate });
      this.event.patchValue({ startDate: arg.startStr, endDate: endDate });
      this.openModal();
    } else {
      console.error('Invalid date range selected.');
    }
  }


  openModal() {
    const modal: any = document.getElementById('exampleModal');
    modal.classList.add('show');
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
  }


  //predifine fullCalendarrComponent
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  changeView(view: string, filterText: string, forDate?: any) {
    const calendarApi = this.calendarComponent.getApi();
    if (forDate) {
      calendarApi.changeView(view, forDate); // Navigate to the specified date
    }

    else
      calendarApi.changeView(view);

    this.filters = filterText;
  }
  dropdownOpen: boolean = false;


  // updateDropdownText() {
  //   const calendarApi = this.calendarComponent.getApi();
  //   const customButtons = {
  //     customDropdown: {
  //       text: this.filters,
  //       click: () => {
  //         const dropdownMenu = document.getElementById('viewDropdownMenu');
  //         if (dropdownMenu) {
  //           dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
  //         }
  //       }

  //     }, customButton1: {
  //       text: 'Calender', // Set the name for custom button 1
  //       click: () => {

  //         console.log('Custom Button 1 clicked');
  //       }
  //     },
  //     customButton3: {
  //       text: '+ Add', // Set the name for custom button 1
  //       click: () => {

  //         console.log('Custom Button 1 clicked');
  //       }
  //     },
  //     customButton2: {
  //       text: 'Task & Event',
  //       click: () => {
  //         // Define the action for custom button 2
  //         this.calenderClass = 'content white_card_background p-4 hidetab'
  //         this.taskDetailClass = 'content'
  //         console.log('Custom Button 2 clicked');

  //       }
  //     },
  //   };
  //   calendarApi.setOption('customButtons', customButtons);

  // }

  changeClass() {
    this.calenderClass = 'content white_card_background p-4'
    this.taskDetailClass = 'content hidetab'
  }


  handleEventClick(arg: any): void {
    const eventId = arg.event.id;

    const extendedProps = arg.event.extendedProps;
    console.log(extendedProps);
    if (extendedProps.type === 'task') {

      const taskId = extendedProps.taskId;
      this.showDetailsPopup(taskId, 'task');
    } else if (extendedProps.type === 'event') {


      const eventId = extendedProps.eventId;
      this.showDetailsPopup(eventId, 'event');

    }
  }


  showDetailsPopup(eventDetails: any, typeEvent: any) {

    switch (typeEvent) {
      case 'task':
        this.selectedTaskId = eventDetails;
        const task = this.tasks.find(t => t.id === eventDetails);
        if (task) {
          this.t = task; // Store the task details
        }
        break;

      case 'event':
        this.selectedEventId = eventDetails;
        const event = this.events.find(e => e.eventId === eventDetails);
        if (event) {
          this.e = event; // Store the event details
        }
        break;
    }

    //show task details popup
    // Display the modal popup
    const modal: HTMLElement | null = document.getElementById(typeEvent);
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }



  t: Task = new Task();
  e: Event = new Event();

  //Add Task
  public addTask() {

    AppUtils.formSubmittion(this.taskForm);

    if (!this.taskForm.valid) {
      return;
    }
    this.taskService.addTask(this.task).subscribe(
      {
        next: (data: any) => {
          this.task = new Task();
          // this.initializeForm();
          this.taskForm.reset();
          // this.
          this.closeModel('exampleModal');
          Toast.fire({
            icon: 'success',
            title: data.message,
          })
            .then(e => {
              this.loadAllTasksAndEvents();
            })
        },
        error: (er: any) => {
          Swal.fire(er.error.message);
        }
      })
  }

// Add Event
public addEvent() {
  AppUtils.formSubmittion(this.eventForm);

  if (!this.eventForm.valid) {
    return;
  }

  this.eventService.addEvent(this.event).subscribe({
    next: (data: any) => {
      this.event = new Event();
      this.eventForm.reset();
      this.closeModel('exampleModal');
      Toast.fire({
        icon: 'success',
        title: data.message,
      }).then(() => {
        this.loadAllTasksAndEvents();
      });
    },
    error: (error: any) => {
      Swal.fire(error.error.message);
    }
  });
}

  //cancel button
  closeModel(elementId: any) {
    const element = document.getElementById(elementId);

    if (element) {
      element.classList.remove('show');
      element.style.display = 'none';
    }
  }

  // button click add model
  openAddModel() {
    const modal = document.getElementById('addTaskModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }


  //load All Events And Tasks
  loadAllTasksAndEvents(): void {
    let check = false;
    if (this.filters == 'Month') {
      check = true;
    }this.tasks=[];
  this.events=[];

    const startDate = AppUtils.startDate;
    const endDate = AppUtils.endDate;
    this.taskService.getAllTasksPagination(this.userId, startDate, endDate).subscribe((listData: any) => {
      this.tasks = listData.data.tasks;
      this.events = listData.data.events;
      this.updateCalendarEvents(check);

    },(error:any)=>{
      Swal.fire(error.error.message);

    });

    // this.eventService.getAllEventsPagination(this.userId, startDate, endDate).subscribe((eventData: any) => {
    //   this.events = eventData.data.data;

    //   this.updateCalendarEvents(check);

    // },(error:any)=>{
    //   Swal.fire(error.error.message);

    // });
  }



  updateCalendarEvents(check: boolean): void {
    // Only update if both tasks and events are loaded
    if (this.tasks && this.events) {

      ; const combinedEvents = [...this.tasks.map(task => ({

        taskId: task.id,
        title: task.title,
        start: task.startDate + 'T' + task.startTime, // Concatenate start date and time
        
        end: this.updateEventDates(task.startDate,task.endDate) + 'T' + task.endTime, // Concatenate end date and time
        color: task.color,

        allDay: this.filters == 'Month' ? true : task.isAllDay,

        extendedProps: {
          type: 'task',
          // details: this.tasks
        }
      })), ...this.events.map(event => ({
        eventId: event.eventId,
        title: event.title,
        start: event.startDate + 'T' + event.startTime, // Concatenate start date and time
        end: this.updateEventDates(event.startDate,event.endDate) + 'T' + event.endTime, // Concatenate end date and time
        color: event.color,
        allDay: this.filters == 'Month' ? true : event.isAllDay,

        extendedProps: {
          type: 'event',
          // details: this.events
        }
      }))];

      this.calendarComponent.getApi().removeAllEvents(); // Clear existing events
      this.calendarComponent.getApi().addEventSource(combinedEvents); // Add combined events to the calendar
    }
  }


  updateEventDates( eventStartDate: any, eventEndDate: any) {
    // Parse startDate and endDate as Date objects
    const startDate = new Date(eventStartDate);
    const endDate = new Date(eventEndDate);
  
    // Compare only the date parts (ignore the time)
    if (startDate.toDateString() !== endDate.toDateString() && this.filters == 'Month') {
      // Add one more day to the endDate
      endDate.setDate(endDate.getDate() + 1);
    }
  
    // Format the updated endDate back to string 'YYYY-MM-DD'
    const formattedEndDate = endDate.toISOString().split('T')[0];
  
    // // Concatenate start date and time, end date and time
    // const start = `${event.startDate}T${event.startTime}`;
    // const end = `${formattedEndDate}T${event.endTime}`;
  
  
    // Return or use the start and end variables as needed
    return formattedEndDate;
  }
  

  
  //delete task
  deleteTask(id: any) {
    this.taskService.deleteTask(id).subscribe((data: any) => {
      this.closeModel('task');
      this.loadAllTasksAndEvents();
      Toast.fire({
        icon: 'success',
        title: data.message,

      })
    },
      (error) => {
      }
    );

  }

  //delete event
  deleteEvent(id: any) {
    this.eventService.deleteEvent(id).subscribe((data: any) => {
      this.closeModel('event');
      this.loadAllTasksAndEvents();
      Toast.fire({
        icon: 'success',
        title: data.message,
      })
    },
      (error) => {
      }
    );

  }
  //add popup open
  isTaskPopupVisibleForAdd: boolean = false;

  showAndRemoveTaskPopupForAdd(showView: boolean) {

    this.isTaskPopupVisibleForAdd = showView;
  }



  onVisibilityChangeForAdd(isVisible: boolean) {

    this.isTaskPopupVisibleForAdd = isVisible;
  }
  //update popup open
  isTaskPopupVisible: boolean = false;
  isEventPopupVisible: boolean = false;
  selectedTaskId: string = '';
  selectedEventId: string = '';


  showTaskOrEventPopup(selectedId: string, changeListView: string) {

    if (changeListView == 'task') {
      this.selectedTaskId = selectedId;
      this.isTaskPopupVisible = true;
    }
    else if (changeListView == 'event') {

      this.selectedEventId = selectedId;
      this.isEventPopupVisible = true;

    }
  }


  hideTaskOrEventPopup(changeEventTaskPopUpView: string) {
    if (changeEventTaskPopUpView == 'task')
      this.isTaskPopupVisible = false;

    else if (changeEventTaskPopUpView == 'event')
      this.isEventPopupVisible = false;
    
this.loadAllTasksAndEvents(); 
  }


  //form validation for task 
  taskForm!: FormGroup;
  eventForm!: FormGroup;

  startOfDay = new Date().toISOString().split('T')[0];
  currentTime = '00:00'


  // endOfDay:any
  initializeForm() {



    this.eventForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      startDate: ['', [Validators.required,]],
      endDate: ['', [Validators.required,]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      createGoogleMeeting: [false],
      notificationTime: [''],
      location: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(2)]],
      color: ['#32c6b1'],
      isAllDay: ['false']
    });

    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      startDate: ['', [Validators.required,]],
      endDate: ['', [Validators.required,]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required,]],
      isAllDay: [false] // Assuming isAllDay is a checkbox or boolean
    }); // Add custom validator for isAllDay and date/time logic
  }




  // setDates(start: any, end: any) {

  //   this.startDate = start;
  //   this.endDate = end;
  // }


  changeValidation(forForm: any) {
    if (forForm == 'TASK') {
      if (!this.task.isAllDay) {
        AppUtils.removeControls(this.taskForm);
        this.task.setTimesForWholeDay(true);
      } else {
        AppUtils.addControls(this.taskForm);
        this.task.setTimesForWholeDay(false);
      }
    }
    else if (forForm == 'EVENT') {
      if (!this.event.isAllDay) {
        AppUtils.removeControls(this.eventForm);
        this.event.setTimesForWholeDay(true);
      } else {
        AppUtils.addControls(this.eventForm);
        this.event.setTimesForWholeDay(false);
      }
    }

  }

  

}
export interface EventModel {
  title: string;
  start: Date;
  allDay: boolean;
}



