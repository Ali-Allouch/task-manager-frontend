import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Task } from '../../../core/models/task';
import { TasksService } from '../../../core/services/tasks';
import { Loader } from '../../../components/loader/loader';
import { TaskDetailsNotFound } from './components/task-details-not-found/task-details-not-found';
import { TaskDetailsForm } from './components/task-details-form/task-details-form';
import { TaskComments } from './components/task-comments/task-comments';

@Component({
  selector: 'app-task-details',
  imports: [FormsModule, Loader, TaskDetailsNotFound, TaskDetailsForm, TaskComments],
  templateUrl: './task-details.html',
  styleUrl: './task-details.scss',
})
export class TaskDetailsComponent implements OnInit {
  task: Task = {
    id: 0,
    title: '',
    description: '',
    status: 'pending',
    created_at: '',
    attachment: null,
  };
  isEditMode = false;
  isLoading = false;
  isFetching = false;
  isDeleting = false;
  taskNotFound = false;
  selectedFile: File | null = null;
  selectedFileName = '';
  isDownloading = false;
  isRemoving = false;

  constructor(
    private route: ActivatedRoute,
    private tasksService: TasksService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.isFetching = true;
      this.taskNotFound = false;
      this.loadTaskData(+id);
    }
  }

  loadTaskData(id: number) {
    this.tasksService.getTaskById(id).subscribe({
      next: (data) => {
        this.task = data;
        this.isFetching = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isFetching = false;
        if (err.status === 404) {
          this.taskNotFound = true;
        } else {
          console.error('An unexpected error occurred', err);
        }
        this.cdr.detectChanges();
      },
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

  saveTask() {
    this.isLoading = true;

    const formData = new FormData();
    formData.append('title', this.task.title);
    formData.append('description', this.task.description || '');
    formData.append('status', this.task.status);

    if (this.selectedFile) {
      formData.append('attachment', this.selectedFile);
    }

    if (this.isEditMode) {
      formData.append('_method', 'PUT');
      this.tasksService.updateTask(this.task.id, formData).subscribe({
        next: () => this.handleSuccess(),
        error: () => this.handleError(),
      });
    } else {
      this.tasksService.addTask(formData).subscribe({
        next: () => this.handleSuccess(),
        error: () => this.handleError(),
      });
    }
  }

  private handleSuccess() {
    this.isLoading = false;
    this.router.navigate(['/dashboard']);
  }

  private handleError() {
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this task?')) {
      this.isDeleting = true;
      this.tasksService.deleteTask(this.task.id).subscribe({
        next: () => {
          this.isDeleting = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isDeleting = false;
          console.error('Delete failed', err);
          this.cdr.detectChanges();
        },
      });
    }
  }

  onDownload() {
    if (!this.task.id) return;

    this.isDownloading = true;
    this.tasksService
      .downloadAttachment(this.task.id)
      .pipe(
        finalize(() => {
          this.isDownloading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = this.task.attachment?.split('/').pop() || 'attachment';
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          this.isDownloading = false;
          console.error('Download failed', err);
        },
      });
  }

  onRemoveAttachment() {
    if (confirm('Are you sure you want to remove the attachment?')) {
      this.isRemoving = true;
      this.tasksService.removeAttachment(this.task.id).subscribe({
        next: () => {
          this.isRemoving = false;
          this.task.attachment = null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isRemoving = false;
          console.error('Failed to remove attachment', err);
        },
      });
    }
  }
}
