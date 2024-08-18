import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskService } from '../../../services/task.service';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [HeaderComponent, TaskFormComponent, TaskListComponent],
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.scss',
})
export class ToDoListComponent implements OnInit {
  data: any[] = [];
  errorMessage: string | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.taskService
      .getAllTasks()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 0) {
            this.errorMessage =
              'Problema no serviço.';
          } else {
            this.errorMessage = 'Erro ao carregar os dados.';
          }
          return of([]);
        })
      )
      .subscribe({
        next: (response) => {
          this.data = response;
        },
      });
  }
}
