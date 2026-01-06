import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { DashboardComponent } from './dashboard';
import { TasksService } from '../../core/services/tasks';
import { AuthService } from '../../core/services/auth';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let tasksServiceMock: any;
  let authServiceMock: any;
  let router: Router;

  beforeEach(async () => {
    tasksServiceMock = {
      getTasks: vi.fn().mockReturnValue(of([])),
    };
    authServiceMock = {
      logout: vi.fn().mockReturnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        { provide: TasksService, useValue: tasksServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadTasks on ngOnInit', () => {
    const spy = vi.spyOn(component, 'loadTasks');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should update currentFilter and reload tasks when setFilter is called', () => {
    const status = 'completed';
    component.setFilter(status);

    expect(component.currentFilter).toBe(status);
    expect(tasksServiceMock.getTasks).toHaveBeenCalledWith(status, '');
  });

  it('should update searchTerm and reload tasks when onSearch is called', () => {
    const query = 'meeting';
    component.onSearch(query);

    expect(component.searchTerm).toBe(query);
    expect(tasksServiceMock.getTasks).toHaveBeenCalledWith('all', query);
  });

  it('should logout and navigate to login on success', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    const localStorageSpy = vi.spyOn(Storage.prototype, 'removeItem');

    component.logout();

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(localStorageSpy).toHaveBeenCalledWith('access_token');
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    expect(component.isLoggingOut).toBe(false);
  });

  it('should handle error when loadTasks fails', () => {
    tasksServiceMock.getTasks.mockReturnValue(throwError(() => new Error('API Error')));
    const consoleSpy = vi.spyOn(console, 'error');

    component.loadTasks();

    expect(component.isLoading).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Something went wrong!', expect.any(Error));
  });
});
