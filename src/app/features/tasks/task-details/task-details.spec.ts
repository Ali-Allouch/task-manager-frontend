import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { TaskDetailsComponent } from './task-details';
import { TasksService } from '../../../core/services/tasks';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('TaskDetailsComponent', () => {
  let component: TaskDetailsComponent;
  let fixture: ComponentFixture<TaskDetailsComponent>;
  let tasksServiceMock: any;
  let router: Router;

  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Desc',
    status: 'pending',
    attachment: 'path/to/file.pdf',
  };

  beforeEach(async () => {
    tasksServiceMock = {
      getTaskById: vi.fn().mockReturnValue(of(mockTask)),
      addTask: vi.fn().mockReturnValue(of({})),
      updateTask: vi.fn().mockReturnValue(of({})),
      deleteTask: vi.fn().mockReturnValue(of({})),
      downloadAttachment: vi.fn().mockReturnValue(of(new Blob())),
      removeAttachment: vi.fn().mockReturnValue(of({})),
      getComments: vi.fn().mockReturnValue(of([])),
      addComment: vi.fn().mockReturnValue(of({})),
      deleteComment: vi.fn().mockReturnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [TaskDetailsComponent],
      providers: [
        provideRouter([]),
        { provide: TasksService, useValue: tasksServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    if (typeof window.URL.createObjectURL === 'undefined') {
      Object.defineProperty(window.URL, 'createObjectURL', { value: vi.fn() });
    }
    if (typeof window.URL.revokeObjectURL === 'undefined') {
      Object.defineProperty(window.URL, 'revokeObjectURL', { value: vi.fn() });
    }

    vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:url');
    vi.spyOn(window.URL, 'revokeObjectURL').mockImplementation(() => {});
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isEditMode to true and load task data if ID exists', () => {
    component.ngOnInit();
    expect(component.isEditMode).toBe(true);
    expect(tasksServiceMock.getTaskById).toHaveBeenCalledWith(1);
    expect(component.task.title).toBe('Test Task');
  });

  it('should set taskNotFound to true if API returns 404', () => {
    tasksServiceMock.getTaskById.mockReturnValue(throwError(() => ({ status: 404 })));
    component.loadTaskData(999999999);
    expect(component.taskNotFound).toBe(true);
  });

  it('should call addTask when saveTask is called in create mode', () => {
    component.isEditMode = false;
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.saveTask();

    expect(tasksServiceMock.addTask).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should call updateTask with _method PUT when in edit mode', () => {
    component.isEditMode = true;
    component.task = { ...mockTask } as any;

    component.saveTask();

    expect(tasksServiceMock.updateTask).toHaveBeenCalled();
  });

  it('should call deleteTask and navigate on confirmation', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.onDelete();

    expect(window.confirm).toHaveBeenCalled();
    expect(tasksServiceMock.deleteTask).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should call removeAttachment and clear attachment property', () => {
    component.task = { ...mockTask } as any;
    component.onRemoveAttachment();

    expect(tasksServiceMock.removeAttachment).toHaveBeenCalled();
    expect(component.task.attachment).toBeNull();
  });

  it('should trigger download logic when onDownload is called', () => {
    component.task = { ...mockTask } as any;
    const linkSpy = vi.spyOn(document, 'createElement');

    component.onDownload();

    expect(tasksServiceMock.downloadAttachment).toHaveBeenCalledWith(1);
    expect(window.URL.createObjectURL).toHaveBeenCalled();
  });
});
