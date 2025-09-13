import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { TasksComponent } from './pages/tasks/tasks.component';
import { UserComponent } from './pages/users/users.component';
import { AddTaskPageComponent } from './pages/add-task-page/add-task-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';

export const routes: Routes = [
    {
    path:"task",
    component:TasksComponent
},
 {
    path:"users",
    component:UserComponent
 } ,
 {
    path:"add-task",
    component:AddTaskPageComponent
 } ,
{
   path:"",
   component:LandingPageComponent
} 
];
