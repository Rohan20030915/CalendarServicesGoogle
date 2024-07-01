import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskServiceService } from '../../service/task-service.service';
import { EventService } from '../../service/event.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import Toast from '../../helper/notifiction';
import { Task } from '../../entity/Task';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent implements OnInit {

  task: Task = new Task();
  public Editor = ClassicEditor;

  constructor(private taskService: TaskServiceService,
    private router: Router, private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.initializeForm();
  }
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() visibilityChange = new EventEmitter<boolean>();

  //Add Task
  public addTask() {
    this.formSubmittion(this.taskForm);
    console.log(this.taskForm.valid);
    //console.log("Staff ->>>> ",this.staff);

    if (!this.taskForm.valid) {
      return;
    }
    this.taskService.addTask(this.task).subscribe((data: any) => {
      this.task = data;
      this.closeModel('addTaskModal');
      Toast.fire({
        icon: 'success',
        title: data.message,
      })
      
    }
    ),
      (error: any) => {
        console.log(error);
        Swal.fire('Not Added !!');
      }
  }
  
  //cancel button
  closeModel(elementId: any) {
    const element = document.getElementById(elementId);

    if (element) {
      element.classList.remove('show');
      element.style.display = 'none';
    }
  }
  //form validation
  taskForm!: FormGroup;

  initializeForm() {
    this.taskForm = this.formBuilder.group({

      title: [
        '',
        [Validators.required],
      ],

      description: [
        '',
        [Validators.required],
      ],
      startDate: [
        '',
        [Validators.required],
      ],
      endDate: [
        '',
        [Validators.required],
      ],

      startTime: [
        '',
        [Validators.required],
      ],
      endTime: [
        '',
        [Validators.required],
      ],


    });
  }

  public formSubmittion(addForm: any) {
    Object.keys(addForm.controls).forEach((key) => {
      const control = addForm.get(key)
        ;
      if (control) {
        control.markAsTouched();
      }
    });
    const firstInvalidControl = document.querySelector('input.ng-invalid');
  }


}
