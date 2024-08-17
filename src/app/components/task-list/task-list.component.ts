import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { ITask } from '../../../models/task.model';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})

export class TaskListComponent implements OnInit {
  tasks: ITask[] = [];
  pendingTasks: ITask[] = [];
  completedTasks: ITask[] = [];

  ngOnInit(): void {
    this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });
  }

  constructor(private taskService: TaskService) {
  }

  getAllTasksList() {
    this.taskService.getAllTasks().subscribe({
      next: (response) => {
        this.tasks = response.sort((a: ITask, b: ITask) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        console.log(
          '[DEBUG]: (getAllTasksService) Tasks recuperada com sucesso',
          response
        );
      },
      error: (error) => {
        console.error(
          '[DEBUG]: (getAllTasksService) Erro ao recuperar as tasks',
          error
        );
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

  deleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe({
      next: (response) => {
        this.taskService.refreshTasks();
        this.taskService.getAllTasks();
        console.log('[DEBUG]: (deleteTask) Task deletada', response);
      },
      error: (error) => {
        console.log('[DEBUG]: (deleteTask) Erro ao deletar a task', error);
      },
    });
  }

  toggleCompletion(task: ITask) {
    task.isCompleted = !task.isCompleted;
    this.taskService.updateTask(task.id, task).subscribe();
  }
}
