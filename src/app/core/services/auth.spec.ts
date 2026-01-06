import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth';
import { vi } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to login API', () => {
    const mockCredentials = { email: 'test@example.com', password: 'password123' };
    const mockResponse = { access_token: 'fake-token-123' };

    service.login(mockCredentials).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/login');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);

    req.flush(mockResponse);
  });

  it('should send a POST request to register API', () => {
    const mockUserData = { name: 'Ali', email: 'ali@test.com', password: 'password' };

    service.register(mockUserData).subscribe();

    const req = httpMock.expectOne('/api/register');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUserData);

    req.flush({ message: 'User registered' });
  });

  it('should include Authorization header in logout request', () => {
    const mockToken = 'test-bearer-token';

    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(mockToken);

    service.logout().subscribe();

    const req = httpMock.expectOne('/api/logout');

    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    req.flush({ message: 'Logged out' });

    getItemSpy.mockRestore();
  });
});
