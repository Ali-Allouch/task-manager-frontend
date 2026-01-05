import { Component, Input, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../../../../core/services/tasks';
import { Loader } from '../../../../../components/loader/loader';

@Component({
  selector: 'app-task-comments',
  standalone: true,
  imports: [CommonModule, FormsModule, Loader],
  templateUrl: './task-comments.html',
  styleUrl: './task-comments.scss',
})
export class TaskComments {
  @Input() taskId!: number;

  comments: any[] = [];
  newCommentContent = '';
  errorMessage: string | null = null;
  isLoading = false;
  isSubmitting = false;

  constructor(private tasksService: TasksService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.isLoading = true;
    this.loadComments();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['taskId'] && !changes['taskId'].firstChange) {
      this.isLoading = true;
      this.loadComments();
    }
  }

  loadComments() {
    this.tasksService.getComments(this.taskId).subscribe({
      next: (data) => {
        this.comments = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load comments', err);
      },
    });
  }

  submitComment() {
    if (!this.newCommentContent.trim()) return;

    this.isSubmitting = true;
    this.errorMessage = null;

    this.tasksService.addComment(this.taskId, this.newCommentContent).subscribe({
      next: (response) => {
        this.comments.unshift(response.comment);
        this.newCommentContent = '';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmitting = false;

        if (err.status === 422 && err.error.errors) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
        }

        this.cdr.detectChanges();
        console.error('An unexpected error occurred', err);
      },
    });
  }

  onDeleteComment(commentId: number) {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.tasksService.deleteComment(commentId).subscribe({
        next: () => {
          this.comments = this.comments.filter((c) => c.id !== commentId);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to delete comment', err);
          alert('Could not delete the comment. Please try again.');
        },
      });
    }
  }
}
