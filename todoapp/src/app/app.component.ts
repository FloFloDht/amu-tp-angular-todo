// src/app/app.component.ts 

import { Component } from '@angular/core';
import { Tasks } from './types/task';

@Component({
  selector: 'app-root',
  template: `
    <div id="app">
        <h1>La Todo App</h1>

        <main>
          <app-todo-list 
            [tasks]="tasks" 
          ></app-todo-list>
          <app-task-form 
            (onNewTask)="addTask($event)"
          ></app-task-form>
        </main>
    </div>
  `,
  styles: []
})
export class AppComponent {
  tasks: Tasks = [
    { id: 1, text: "Aller faire des courses", done: false },
    { id: 2, text: "Faire à manger", done: true },
  ];

  // La méthode addTask recevra une string
  addTask(text: string) {
    // Elle s'en servira pour créer une nouvelle tâche dans 
    // le tableau des tâches, et Angular mettra à jour 
    // l'affichage afin d'en tenir compte !
    this.tasks.push({
      id: Date.now(),
      text: text,
      done: false
    });
  }
}