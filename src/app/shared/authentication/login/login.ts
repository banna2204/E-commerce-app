import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { CustomValidator } from '../../custom-validator/custom-validator';
import { Auth } from '../../services/auth';

interface User {
  email: string,
  password: string,
}

@Component({
  selector: 'app-login',
  imports: [MatInputModule, ReactiveFormsModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  auth = inject(Auth);
  router = inject(Router);
  hide = signal<boolean>(false);
  invalidCredentials = signal<boolean>(false);

  authGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(5), CustomValidator.noSpace]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), CustomValidator.noSpace]),
  });


  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.preventDefault();
  }

  onSubmit() {
    const loginUser = this.authGroup.getRawValue() as User;
    this.auth.login(loginUser).subscribe({
      next: (res) => {
        if(res) {
          localStorage.setItem('user', JSON.stringify(res))
          this.invalidCredentials.set(false);
          this.router.navigate(['/customer']);
        } else{
          this.invalidCredentials.set(true);
        }
        this.authGroup.reset();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
