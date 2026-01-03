import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Task } from '../../core/models/task';
import { AuthService } from '../../core/services/auth';
import { TasksService } from '../../core/services/tasks';
import { Loader } from '../../components/loader/loader';
import { DashboardHeader } from './components/dashboard-header/dashboard-header';
import { DashboardFilter } from './components/dashboard-filter/dashboard-filter';
import { DashboardTasksGrid } from './components/dashboard-tasks-grid/dashboard-tasks-grid';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Loader, DashboardHeader, DashboardFilter, DashboardTasksGrid],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  isLoading = false;
  currentFilter: string = 'all';

  constructor(
    private tasksService: TasksService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  setFilter(status: string) {
    this.currentFilter = status;
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading = true;
    this.tasksService.getTasks(this.currentFilter).subscribe({
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
