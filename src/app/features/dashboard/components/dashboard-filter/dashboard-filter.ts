import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dashboard-filter',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-filter.html',
  styleUrl: './dashboard-filter.scss',
})
export class DashboardFilter {
  @Input() currentFilter: string = 'all';

  @Output() filterChange = new EventEmitter<string>();

  setFilter(status: string) {
    this.filterChange.emit(status);
  }
}
