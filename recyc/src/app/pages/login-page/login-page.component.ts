import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);

  constructor(private router: Router) { }

  navigateBack() {
    this.router.navigate(['/home']);
  }

  onLogin() {
    if (!this.emailFormControl.valid || !this.passwordFormControl.valid) {
      // Afișați mesaje de eroare
      return;
    }
  
    const email = this.emailFormControl.value;
    const password = this.passwordFormControl.value;
  
    // Obținem lista de utilizatori din Local Storage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
  
    // Căutăm înregistrarea care se potrivește cu email-ul și parola
    const found = users.find((user: { email: string | null; password: string | null; }) => user.email === email && user.password === password);
  
    if (found) {
      console.log('Login successful!');
      this.router.navigate(['/test-map']);
    } else {
      console.log('Login failed!');
      alert('Email sau parola incorecte!');
    }
  }
  
}
