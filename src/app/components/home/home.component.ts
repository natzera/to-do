import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { TaskService } from '../../../services/task.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ITask } from '../../../models/task.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [HeaderComponent, ReactiveFormsModule]
})
export class HomeComponent implements OnInit {
  taskForm: FormGroup;
  tasks: ITask[] = []

  ngOnInit(): void {
    this.getAllTasks()
  }

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.taskForm = this.fb.group({
      name: new FormControl('', [Validators.required])
    })
  }

  getAllTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (response) => {
        this.tasks = response;
      }
    });
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.getAllTasks();
      }
    })
  }

  updateTask(id: string, updateTask: ITask) {
    this.taskService.updateTask(id, updateTask).subscribe({
      next: (response) => {
        console.log('Tarefa atualizada com sucesso:', response);
      },
      error: (error) => {
        console.error('Erro ao atualizar a tarefa:', error);

      }
    })
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const newTask: ITask = {
        name: this.taskForm.value.name,
        isCompleted: false,
        id: uuidv4()
      };

      this.tasks.unshift(newTask);

      this.taskService.createTask(newTask).subscribe({
        next: () => {
          this.taskForm.reset();
        }
      });
    } else {
      this.taskForm.markAsUntouched();
    }
  }

  toggleCompletion(task: ITask) {
    task.isCompleted = !task.isCompleted;
    this.taskService.updateTask(task.id, task).subscribe();
  }
}
