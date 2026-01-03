import { Component, Input } from '@angular/core';
import { Task } from '../../../../core/models/task';
import { TaskCard } from '../../../../components/task-card/task-card';

@Component({
  selector: 'app-dashboard-tasks-grid',
  imports: [TaskCard],
  templateUrl: './dashboard-tasks-grid.html',
  styleUrl: './dashboard-tasks-grid.scss',
})
export class DashboardTasksGrid {
  @Input() tasks: Task[] = [];
}
