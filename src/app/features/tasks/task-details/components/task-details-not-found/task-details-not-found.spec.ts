import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailsNotFound } from './task-details-not-found';

describe('TaskDetailsNotFound', () => {
  let component: TaskDetailsNotFound;
  let fixture: ComponentFixture<TaskDetailsNotFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailsNotFound]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDetailsNotFound);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
