import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTasksGrid } from './dashboard-tasks-grid';

describe('DashboardTasksGrid', () => {
  let component: DashboardTasksGrid;
  let fixture: ComponentFixture<DashboardTasksGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTasksGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTasksGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
