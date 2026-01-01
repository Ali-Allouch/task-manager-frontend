import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Task } from '../../../core/models/task';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from '../../../core/services/tasks';
import { Router, RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-details',
  imports: [FormsModule, RouterLink],
  templateUrl: './task-details.html',
  styleUrl: './task-details.scss',
})
export class TaskDetailsComponent implements OnInit {
  task: Task = { id: 0, title: '', description: '', status: 'pending', created_at: '' };
  isEditMode = false;
  isLoading = false;
  isFetching = false;
  isDeleting = false;
  taskNotFound = false;

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

  saveTask() {
    this.isLoading = true;
    const request = this.isEditMode
      ? this.tasksService.updateTask(this.task.id, this.task)
      : this.tasksService.addTask(this.task);

    request.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
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
}
