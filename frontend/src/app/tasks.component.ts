import { Component, OnInit, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export interface Task { id: number; title: string; description: string; priority: string; dueDate: string | null; status: string; }

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  
  tasks = signal<Task[]>([]);
  filterPriority = signal<string>('All'); 
  filteredTasks = computed(() => {
    const currentFilter = this.filterPriority();
    if (currentFilter === 'All') return this.tasks();
    return this.tasks().filter(t => t.priority === currentFilter);
  });
  
  apiUrl = 'http://127.0.0.1:5156/api/Tasks'; 
  
  constructor(private http: HttpClient) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() { 
    if (isPlatformBrowser(this.platformId)) {
      this.fetchTasks(); 
    }
  }
  
  fetchTasks() {
    this.http.get<Task[]>(this.apiUrl).subscribe({
      next: (data) => this.tasks.set(data),
      error: (err) => console.error('Error fetching tasks:', err)
    });
  }
  
  addTask(title: string, priority: string) {
    if (!title.trim()) return; 
    const newTask = { title, description: 'Added from web interface', priority, dueDate: null, status: 'Todo' };
    this.http.post<Task>(this.apiUrl, newTask).subscribe({
      next: (createdTask) => this.tasks.update(tasks => [...tasks, createdTask]),
      error: (err) => console.error('Error adding task:', err)
    });
  }

  updateStatus(task: Task) {
    const newStatus = task.status === 'Todo' ? 'Done' : 'Todo';
    const updatedTask = { ...task, status: newStatus };
    this.http.put(`${this.apiUrl}/${task.id}`, updatedTask).subscribe({
      next: () => this.tasks.update(tasks => tasks.map(t => t.id === task.id ? updatedTask : t)),
      error: (err) => console.error('Error updating task:', err)
    });
  }

  deleteTask(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => this.tasks.update(tasks => tasks.filter(t => t.id !== id)),
      error: (err) => console.error('Error deleting task:', err)
    });
  }
}