import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { TasksComponent } from './tasks.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'tasks', component: TasksComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/tasks', pathMatch: 'full' }
];