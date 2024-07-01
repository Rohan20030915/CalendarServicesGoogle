import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { TaskServiceService } from '../../service/task-service.service';
import { Task } from '../../entity/Task';
import Toast from '../../helper/notifiction';
import { Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppUtils } from '../datalist/AppUtils ';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrl: './update-task.component.css',
})
export class UpdateTaskComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() taskId!: string;
  @Output() close = new EventEmitter<void>();
  @Output() visibilityChange = new EventEmitter<boolean>();
  startOfDay = new Date().toISOString().split('T')[0];

  task: Task = new Task();
  public Editor = ClassicEditor;
  taskForm!: FormGroup;
  public showBox = false;

  constructor(private taskService: TaskServiceService, private formBuilder: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // this.fetchTaskDetails();
  }

  onMouseEnter(): void {
    this.showBox = true;
  }

  onMouseLeave(): void {
    this.showBox = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible'] && this.isVisible) {
      this.fetchTaskDetails();
    }
    this.visibilityChange.emit(this.isVisible);
  }

  closeModel(elementId: any) {
    const element = document.getElementById(elementId);

    if (element) {
      element.classList.remove('show');
      element.style.display = 'none';
    }
  }

  fetchTaskDetails() {
    if (this.taskId) {
      this.taskService.getSingleTaskById(this.taskId).subscribe((data: any) => {
        this.task = data.data.data;
      });
    }
  }

  onClose() {
    this.isVisible = false;
    this.closeModel('taskedit');
    this.visibilityChange.emit(this.isVisible);
    this.close.emit();
  }

  updateTask() {
    alert('came')
    AppUtils.formSubmittion(this.taskForm);

    if (!this.taskForm.valid) {
      return;
    }
    this.taskService.updatetask(this.task).subscribe({
      next: (data: any) => {
        this.task = new Task();
        this.taskForm.reset();
        this.onClose();
        Toast.fire({
          icon: 'success',
          title: data.message,
        }).then(() => {});
      },
      error: (error: any) => {
        Swal.fire(error.error.message);
      }
    });
  }

  initializeForm() {
    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      startDate: ['', [Validators.required]],
      endDate: [''],
      startTime: [''],
      endTime: [''],
      isAllDay: [false]
    });
    
      this.changeValidation();
    
  }

  changeValidation() {
    if (!this.task.isAllDay) {
      AppUtils.removeControls(this.taskForm);
      this.setTimesForWholeDay(true);
    } else {
      AppUtils.addControls(this.taskForm);
      this.setTimesForWholeDay(false);
    }
  }

  setTimesForWholeDay(checkCondition: boolean): void {
    if (checkCondition) {
      this.task.endDate = this.task.startDate;
      this.task.startTime = '00:00';
      this.task.endTime = '23:59';
    } else {
      this.task.endDate = '';
      this.task.startTime = '';
      this.task.endTime = '';
    }
  }
}
