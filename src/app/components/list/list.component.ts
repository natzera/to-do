import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { TaskService } from '../../../services/task.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ITask } from '../../../models/task.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-list',
  standalone: true,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  imports: [HeaderComponent, ReactiveFormsModule, FormsModule],
})
export class ListComponent implements OnInit {
  taskForm: FormGroup;
  tasks: ITask[] = [];

  ngOnInit(): void {
    this.getAllTasks();
  }

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.taskForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
    });
  }

  private getAllTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (response) => {
        this.tasks = response.sort((a: ITask, b: ITask) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        console.log(
          '[DEBUG]: (getAllTasks) Tasks recuperada com sucesso',
          response
        );
      },
      error: (error) => {
        console.error(
          '[DEBUG]: (getAllTasks) Erro ao recuperar as tasks',
          error
        );
      },
    });
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe({
      next: (response) => {
        this.getAllTasks();
        console.log('[DEBUG]: (deleteTask) Task deletada', response);
      },
      error: (error) => {
        console.log('[DEBUG]: (deleteTask) Erro ao deletar a task', error);
      },
    });
  }

  updateTask(task: ITask) {
    this.taskService.updateTask(task.id, task).subscribe({
      next: (response) => {
        console.log('[DEBUG]: (updateTask) Task atualizada com sucesso', response);
      },
      error: (error) => {
        console.error('[DEBUG]: (updateTask) Erro ao atualizar a task', error);
      },
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const newTask: ITask = {
        id: uuidv4(),
        name: this.taskForm.value.name,
        isCompleted: false,
        createdAt: new Date().toISOString(),
      };

      this.taskService.createTask(newTask).subscribe({
        next: (response) => {
          this.tasks.unshift(response);
          this.taskForm.reset();
          console.log('[DEBUG]: (onSubmit) Task criada com sucesso', response);
        },
        error: (error) => {
          console.error('[DEBUG]: (onSubmit) Erro ao criar a task', error);
        },
      });
    } else {
      this.taskForm.markAsTouched();
    }
  }

  toggleCompletion(task: ITask) {
    task.isCompleted = !task.isCompleted;
    this.taskService.updateTask(task.id, task).subscribe();
  }
}
