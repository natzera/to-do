import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { ITask } from '../models/task.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = 'http://localhost:3000';
  private tasksSubject = new BehaviorSubject<ITask[]>([]);
  tasks$ = this.tasksSubject.asObservable();
  taskForm: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
  ) {
    this.taskForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
    });
    this.loadTasks();
  }

  getAllTasks(): Observable<ITask[]> {
    return this.http.get<ITask[]>(`${this.baseUrl}/tasks`);
  }

  getTask(id: string): Observable<ITask> {
    return this.http.get<ITask>(`${this.baseUrl}/tasks/${id}`);
  }

  createTask(task: ITask): Observable<ITask> {
    return this.http.post<ITask>(`${this.baseUrl}/tasks`, task);
  }

  updateTask(id: string, task: ITask): Observable<ITask> {
    return this.http.put<ITask>(`${this.baseUrl}/tasks/${id}`, task);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tasks/${id}`);
  }

  private loadTasks(): void {
    this.getAllTasks().subscribe(tasks => this.tasksSubject.next(tasks));
  }

  refreshTasks(): void {
    this.loadTasks();
  }
}
