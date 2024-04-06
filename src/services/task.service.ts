import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ITask } from "../models/task.model";

@Injectable({
  providedIn: 'root',
})

export class TaskService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {

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

  updateTask(id: string, task: ITask) {
    return this.http.put<ITask>(`${this.baseUrl}/tasks/${id}`, task);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tasks/${id}`);
  }

}

