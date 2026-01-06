import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TaskComments } from './task-comments';
import { TasksService } from '../../../../../core/services/tasks';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('TaskComments', () => {
  let component: TaskComments;
  let fixture: ComponentFixture<TaskComments>;
  let tasksServiceMock: any;

  beforeEach(async () => {
    tasksServiceMock = {
      getComments: vi.fn().mockReturnValue(of([])),
      addComment: vi.fn().mockReturnValue(of({})),
      deleteComment: vi.fn().mockReturnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [TaskComments],
      providers: [
        { provide: TasksService, useValue: tasksServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskComments);
    component = fixture.componentInstance;
    component.taskId = 1;

    vi.stubGlobal('confirm', vi.fn().mockReturnValue(true));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load comments for the given taskId on ngOnInit', () => {
    const mockComments = [{ id: 1, content: 'First Comment' }];
    tasksServiceMock.getComments.mockReturnValue(of(mockComments));

    fixture.detectChanges();

    expect(tasksServiceMock.getComments).toHaveBeenCalledWith(1);
    expect(component.comments.length).toBe(1);
  });

  it('should add a new comment and unshift it to the top of the list', () => {
    const existingComments = [{ id: 1, content: 'Old Comment' }];
    const newComment = { id: 2, content: 'Newest Comment' };

    component.comments = [...existingComments];
    component.newCommentContent = 'Newest Comment';

    tasksServiceMock.addComment.mockReturnValue(of({ comment: newComment }));

    component.submitComment();

    expect(tasksServiceMock.addComment).toHaveBeenCalledWith(1, 'Newest Comment');
    expect(component.comments[0].id).toBe(2);
    expect(component.newCommentContent).toBe('');
    expect(component.isSubmitting).toBe(false);
  });

  it('should handle 422 validation error when content is too short', () => {
    const errorResponse = {
      status: 422,
      error: { message: 'Content is too short', errors: { content: [] } },
    };
    tasksServiceMock.addComment.mockReturnValue(throwError(() => errorResponse));
    component.newCommentContent = 's';

    component.submitComment();

    expect(component.errorMessage).toBe('Content is too short');
    expect(component.isSubmitting).toBe(false);
  });

  it('should delete comment and remove it from the local list', () => {
    component.comments = [
      { id: 1, content: 'C1' },
      { id: 2, content: 'C2' },
    ];

    component.onDeleteComment(1);

    expect(window.confirm).toHaveBeenCalled();
    expect(tasksServiceMock.deleteComment).toHaveBeenCalledWith(1);
    expect(component.comments.length).toBe(1);
    expect(component.comments.find((c) => c.id === 1)).toBeUndefined();
  });
});
