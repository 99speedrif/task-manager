import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div style="max-width: 400px; margin: 100px auto; font-family: sans-serif; padding: 30px; border: 1px solid #eaeaea; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); background-color: white;">
    <h2 style="text-align: center; margin-bottom: 25px;">Login to Task Manager</h2>
    
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      
      <div style="margin-bottom: 15px;">
        <label style="font-weight: bold; font-size: 14px;">Email:</label>
        <input type="email" formControlName="email" style="width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
        <small *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" style="color: red; display: block; margin-top: 5px;">Valid email is required.</small>
      </div>
      
      <div style="margin-bottom: 25px;">
        <label style="font-weight: bold; font-size: 14px;">Password:</label>
        
        <!-- Relative container to place the button inside the input -->
        <div style="position: relative; margin-top: 5px;">
          
          <!-- Type switches between 'password' and 'text' dynamically -->
          <input [type]="showPassword ? 'text' : 'password'" formControlName="password" style="width: 100%; padding: 10px; padding-right: 40px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
          
          <!-- The Eye Toggle Button -->
          <button type="button" (click)="showPassword = !showPassword" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 16px; padding: 0;">
            {{ showPassword ? '😲' : '😊' }}
          </button>
          
        </div>
        <small *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" style="color: red; display: block; margin-top: 5px;">Password is required.</small>
      </div>

      <button type="submit" [disabled]="loginForm.invalid" style="width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: bold;">
        Login
      </button>
    </form>
  </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: () => alert('Login failed! Check your credentials.')
      });
    }
  }
}