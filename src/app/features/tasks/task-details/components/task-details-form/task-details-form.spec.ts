import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TaskDetailsForm } from './task-details-form';

describe('TaskDetailsForm', () => {
  let component: TaskDetailsForm;
  let fixture: ComponentFixture<TaskDetailsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailsForm],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailsForm);
    component = fixture.componentInstance;

    component.task = {
      id: 1,
      title: 'Testing Form',
      description: 'Test description',
      status: 'pending',
    } as any;

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
