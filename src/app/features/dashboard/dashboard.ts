import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { TasksService } from '../../core/services/tasks';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Task } from '../../core/models/task';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  isLoading = false;

  constructor(
    private tasksService: TasksService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading = true;
    this.tasksService.getTasks().subscribe({
      next: (res) => {
        this.tasks = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Something went wrong!', err);
        this.cdr.detectChanges();
      },
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.clearSession();
      },
      error: (err) => {
        console.error('Logout failed on server', err);
        this.clearSession();
      },
    });
  }

  private clearSession() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}
