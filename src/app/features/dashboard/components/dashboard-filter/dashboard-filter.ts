import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-dashboard-filter',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-filter.html',
  styleUrl: './dashboard-filter.scss',
})
export class DashboardFilter {
  @Input() currentFilter: string = 'all';
  @Input() searchTerm: string = '';

  @Output() filterChange = new EventEmitter<string>();
  @Output() searchChange = new EventEmitter<string>();

  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe((value) => {
      this.searchChange.emit(value);
    });
  }

  onSearchInput(event: any) {
    this.searchSubject.next(event.target.value);
  }

  setFilter(status: string) {
    this.filterChange.emit(status);
  }

  ngOnDestroy() {
    this.searchSubject.unsubscribe();
  }
}
