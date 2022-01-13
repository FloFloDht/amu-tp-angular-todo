// src/app/app.component.ts 

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Tasks } from './types/task';
import { TasksService } from './api/tasks.service';

@Component({
  selector: 'app-root',
  template: `
    <div id="app">
        <h1>La Todo App</h1>

        <main>
          <app-todo-list 
            [tasks]="tasks" 
            (onToggle)="toggle($event)"
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
  tasks: Tasks = [];

  // Grâce au constructor, on peut indiquer à Angular que notre
  // composant aura besoin d'une instance de la classe HttpClient

  constructor(private http : HttpClient, private service: TasksService){  }

  // La méthode ngOnInit sera appelée par Angular lors du chargement 
  // du composant. C'est typiquement ici que l'on placera nos comportements
  // complexes à exécuter au départ :
    ngOnInit() {
    // On remplace le code de la requête HTTP par l'appel
    // à la méthode findAll() de notre service, qui renverra
    // exactement la même chose que ce que renvoyait le
    // HttpClient, on réagira donc de la même manière via la 
    // méthode subscribe()
    this.service
      .findAll()
      .subscribe((tasks) => this.tasks = tasks)
  }
  

  // La méthode addTask recevra une string
  addTask(text: string) {

    this.service
      .create(text)
      .subscribe((tasks) => this.tasks.push(tasks[0]));
  }

  toggle(id: number) {
    const task = this.tasks.find(task => task.id === id);

    if (task) {
      const isDone = !task.done;

      this.service
        .toggleDone(id, isDone)
        .subscribe(() => task.done = isDone);
    }
  }

}