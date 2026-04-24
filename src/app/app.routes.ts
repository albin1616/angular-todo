import { Routes } from '@angular/router';
import { Todo } from './component/todo/todo';
import { About } from './component/about/about';

export const routes: Routes = [
  { path: '', component: Todo },
  { path: 'about', component: About },
  { path: '**', redirectTo: '' }
];
