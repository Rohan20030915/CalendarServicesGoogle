import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Task } from '../../entity/Task';
import { EventService } from '../../service/event.service';
import { Router } from '@angular/router';
import Toast from '../../helper/notifiction';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { AppUtils } from '../datalist/AppUtils ';
import Swal from 'sweetalert2';
import { Event } from '../../entity/Event';

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrl: './update-event.component.css',

})
export class UpdateEventComponent {



  @Input() isVisible: boolean = false;
  @Input() eventId!: string;
  @Output() close = new EventEmitter<void>();
  @Output() visibilityChange = new EventEmitter<boolean>();

  event: Event = new Event();
  public Editor = ClassicEditor;
  eventForm!: FormGroup;
  startOfDay = new Date().toISOString().split('T')[0];
  constructor(private eventService: EventService, private router: Router, private formBuilder: FormBuilder,) {
    this.initializeForm();
  }
  ngOnInit(): void {

    // this.fetchTaskDetails();
    //this.ngOnChanges;

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible'] && this.isVisible) {

      this.fetchTaskDetails();
    }
    this.visibilityChange.emit(this.isVisible);
  }

  fetchTaskDetails() {
    if (this.eventId) {
      this.eventService.getSingleEventById(this.eventId).subscribe((data: any) => {
        this.event = data.data.data;

      });
    }
  }


  onClose() {
    this.isVisible = false;
    this.visibilityChange.emit(this.isVisible);
    this.close.emit();
  }

  //update Task
  updateEvent() {
    AppUtils.formSubmittion(this.eventForm);

    if (!this.eventForm.valid) {
      return;
    }
    this.eventService.updateEvent(this.event).subscribe({
      next: (data: any) => {
        this.event = new Event();
        this.eventForm.reset();
        this.onClose();
        Toast.fire({
          icon: 'success',
          title: data.message,
        }).then(() => {
        });
      },
      error: (error: any) => {
        Swal.fire(error.error.message);
      }
    });
  }


  // endOfDay:any
  initializeForm() {

    this.eventForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      startDate: ['', [Validators.required,]],
      endDate: [''],
      startTime: [''],
      endTime: [''],
      createGoogleMeeting: [false],
      notificationTime: [''],
      location: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(2)]],
      color: ['#32c6b1'],
      isAllDay: ['false']
    });
    if (this.event.isAllDay) {
      this.changeValidation();
    }
  }



  changeValidation() {
    if (!this.event.isAllDay) {
      AppUtils.removeControls(this.eventForm);
      this.setTimesForWholeDay(true);
    } else {
      AppUtils.addControls(this.eventForm);
      this.setTimesForWholeDay(false);
    }
  }

  setTimesForWholeDay(checkCondition: boolean): void {
    if (checkCondition) {
      this.event.endDate = this.event.startDate;
      this.event.startTime = '00:00'; // Start of the day
      this.event.endTime = '23:59'; // End of the day
    }
    else {
      this.event.endDate = "";

      this.event.startTime = ''; // Start of the day
      this.event.endTime = ''; // End of the day

    }
  }



}



