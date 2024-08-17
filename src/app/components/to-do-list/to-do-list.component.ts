import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskListComponent } from '../task-list/task-list.component';

@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [HeaderComponent, TaskFormComponent, TaskListComponent],
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.scss'
})
export class ToDoListComponent {

}
