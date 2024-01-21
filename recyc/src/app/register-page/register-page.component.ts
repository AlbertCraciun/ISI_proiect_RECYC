import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);
  passwordConfirmFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);

  constructor(private router: Router) { }

  navigateBack() {
    this.router.navigate(['/home']);
  }

  // Crearea grupului de formulare cu ambele controale de parolă
  formGroup = new FormGroup({
    passwordFormControl: this.passwordFormControl,
    passwordConfirmFormControl: this.passwordConfirmFormControl
  }, { validators: this.checkPasswords }); // Adăugarea validatorului la grup

  // Validatorul pentru verificarea dacă parolele coincid
  checkPasswords(group: AbstractControl): {[key: string]: any} | null {
    const pass = group.get('passwordFormControl')?.value;
    const confirmPass = group.get('passwordConfirmFormControl')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  onRegister() {
    if (this.emailFormControl.valid && this.passwordFormControl.valid && this.passwordConfirmFormControl.valid) {

        const email = this.emailFormControl.value;
        const password = this.passwordFormControl.value;

        // Obținem lista actuală de utilizatori din Local Storage
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Verificăm dacă email-ul este deja folosit
        const userExists = users.find((user: { email: string | null; password: string | null; }) => user.email === email);
        if (userExists) {
            alert('Un utilizator cu acest email există deja.');
            return;
        }

        // Adăugăm noul utilizator în listă
        users.push({ email, password });

        // Salvăm lista actualizată în Local Storage
        localStorage.setItem('users', JSON.stringify(users));

        // Navigați către pagina de login sau direct către pagina de map după înregistrare
        this.router.navigate(['/login']);
    } else {
        // Afișați mesaje de eroare sau tratați cazurile de formular invalid
    }
  }
}
