import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { CustomValidator } from '../../custom-validator/custom-validator';

interface User {
  id?: string,
  name: string,
  email: string,
  password: string,
  phone: number
}

@Component({
  selector: 'app-registration',
  imports: [MatInputModule, ReactiveFormsModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './registration.html',
  styleUrl: './registration.scss',
})
export class Registration {
  auth = inject(Auth);
  router = inject(Router);

  authGroup = new FormGroup({
    name: new FormControl('', [Validators.required,Validators.minLength(3), CustomValidator.noSpace]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(5), CustomValidator.noSpace]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), CustomValidator.noSpace]),
    phone: new FormControl(0,[Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^\d{10}$/), CustomValidator.noSpace]),
  });

  hide = signal<boolean>(false);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.preventDefault();
  }

  onSubmit() {
    const newUser = this.authGroup.getRawValue() as User;
    this.auth.createUser(newUser).subscribe({
      next: (res) => {
        this.authGroup.reset();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
