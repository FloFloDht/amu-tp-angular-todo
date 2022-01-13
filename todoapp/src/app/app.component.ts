// src/app/app.component.ts 

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  tasks: Tasks = [];

  // Grâce au constructor, on peut indiquer à Angular que notre
  // composant aura besoin d'une instance de la classe HttpClient

  constructor(private http : HttpClient){
    // Ayant obtenu l'instance de HttpClient, on peut l'utiliser
    // pour appeler Supabase en méthode GET. On peut tout de suite
    // indiquer à la méthode GET qu'elle doit s'attendre à recevoir un json
    // correspondant à un tableau de tâches (le fameux type Tasks).
    // On n'oubliera pas aussi de préciser pour cette requête HTTP
    // les entêtes importantes comme le Content-Type ou la clé API
    this.http.get<Tasks>('https://bfxuknbmubeqdrtgqmrj.supabase.co/rest/v1/todosReact', {
      headers: {
        "Content-type" : "application.json",
        apiKey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTgyNDk3MywiZXhwIjoxOTU3NDAwOTczfQ.KabUwP4iOJcH6PsOedizvsT3lrX4LSh7KDelwznXE3E"
      }
    })
    // Lorsque la requête aura terminé son travail et que le serveur
    // aura répondu, nous recevrons une liste de tâches que
    // nous pourrons alors assigner à notre propriété "tasks"
    .subscribe((tasks) => this.tasks = tasks)
  }
  
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