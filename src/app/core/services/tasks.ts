import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private apiUrl = '/api/tasks';

  constructor(private http: HttpClient) {}

  getTasks(status?: string, search: string = ''): Observable<Task[]> {
    let params = new HttpParams();

    if (status && status !== 'all') {
      params = params.set('status', status);
    }

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<Task[]>(this.apiUrl, { params });
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  addTask(taskData: any): Observable<any> {
    return this.http.post(this.apiUrl, taskData);
  }

  updateTask(id: number, taskData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, taskData);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  downloadAttachment(taskId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${taskId}/download`, {
      responseType: 'blob',
    });
  }

  removeAttachment(taskId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${taskId}/attachment`);
  }

  getComments(taskId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${taskId}/comments`);
  }

  addComment(taskId: number, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${taskId}/comments`, { content });
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`/api/comments/${commentId}`);
  }
}
