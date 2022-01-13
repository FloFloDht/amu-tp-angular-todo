import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { TaskFormComponent } from './task-form.component';
import { TodoListComponent } from './todo-list.component';
import { TasksService } from './api/tasks.service';
import { TodoListPageComponent } from './pages/todo-list-page.component';
import { TodoDetailsPageComponent } from './pages/todo-details-page.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', component: TodoListPageComponent},
  {path: ':id/details', component: TodoDetailsPageComponent}
]

@NgModule({
  declarations: [
    AppComponent, 
    TodoListComponent,
    TaskFormComponent,
    TodoListPageComponent,
    TodoDetailsPageComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [TasksService],
  bootstrap: [AppComponent]
})
export class AppModule { }
