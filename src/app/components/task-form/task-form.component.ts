import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { TaskListComponent } from "../task-list/task-list.component";
import { TaskService } from '../../../services/task.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ITask } from '../../../models/task.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-task-form',
  standalone: true,
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
  imports: [HeaderComponent, ReactiveFormsModule, FormsModule, TaskListComponent]
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  tasks: ITask[] = []

  ngOnInit(): void {
    
  }

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.taskForm = this.fb.group({
      name: new FormControl('', [Validators.required])
    })
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
          this.taskService.refreshTasks();
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

}
