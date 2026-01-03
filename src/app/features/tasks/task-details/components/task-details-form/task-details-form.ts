import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Task } from '../../../../../core/models/task';

@Component({
  selector: 'app-task-details-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './task-details-form.html',
  styleUrl: './task-details-form.scss',
})
export class TaskDetailsForm {
  @Input() task!: Task;
  @Input() isEditMode = false;
  @Input() isLoading = false;
  @Input() isDeleting = false;
  @Input() isDownloading = false;
  @Input() selectedFileName = '';

  @Output() save = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() download = new EventEmitter<void>();
  @Output() fileSelected = new EventEmitter<any>();
}
