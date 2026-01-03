import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailsForm } from './task-details-form';

describe('TaskDetailsForm', () => {
  let component: TaskDetailsForm;
  let fixture: ComponentFixture<TaskDetailsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDetailsForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
