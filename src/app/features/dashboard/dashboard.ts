import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { TasksService } from '../../core/services/tasks';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Task } from '../../core/models/task';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];

  constructor(
    private tasksService: TasksService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.tasksService.getTasks().subscribe({
      next: (res) => {
        this.tasks = res;
      },
      error: (err) => console.error('Something went wrong, please try again later!', err),
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
