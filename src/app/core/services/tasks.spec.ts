import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TasksService } from './tasks';
import { Task } from '../models/task';

describe('TasksService', () => {
  let service: TasksService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TasksService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TasksService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch tasks with correct query parameters', () => {
    const mockTasks: Task[] = [{ id: 1, title: 'Task 1', status: 'pending' } as any];

    service.getTasks('pending', 'search term').subscribe((tasks) => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(
      (request) =>
        request.url === '/api/tasks' &&
        request.params.get('status') === 'pending' &&
        request.params.get('search') === 'search term'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should request attachment download as a blob', () => {
    const mockBlob = new Blob(['test content'], { type: 'application/pdf' });
    const taskId = 5;

    service.downloadAttachment(taskId).subscribe((response) => {
      expect(response instanceof Blob).toBe(true);
      expect(response.size).toBeGreaterThan(0);
    });

    const req = httpMock.expectOne(`/api/tasks/${taskId}/download`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');

    req.flush(mockBlob);
  });

  it('should post a new comment to the correct task endpoint', () => {
    const taskId = 8;
    const commentContent = 'This is a test comment';
    const mockResponse = { id: 1, content: commentContent };

    service.addComment(taskId, commentContent).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`/api/tasks/${taskId}/comments`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ content: commentContent });

    req.flush(mockResponse);
  });

  it('should delete a comment using the global comments endpoint', () => {
    const commentId = 10;

    service.deleteComment(commentId).subscribe();

    const req = httpMock.expectOne(`/api/comments/${commentId}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });

  it('should handle validation errors (422) when adding a comment', () => {
    const taskId = 8;
    const errorResponse = {
      message: 'The content field must be at least 2 characters.',
      errors: { content: ['The content field must be at least 2 characters.'] },
    };

    service.addComment(taskId, 's').subscribe({
      next: () => expect.fail('Should have failed with 422 error'),
      error: (error) => {
        expect(error.status).toBe(422);
        expect(error.error.errors.content[0]).toContain('at least 2 characters');
      },
    });

    const req = httpMock.expectOne(`/api/tasks/${taskId}/comments`);
    req.flush(errorResponse, { status: 422, statusText: 'Unprocessable Content' });
  });
});
