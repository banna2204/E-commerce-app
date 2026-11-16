import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomValidator } from '../../custom-validator/custom-validator';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {
  authGroup = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8), CustomValidator.noSpace]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8), CustomValidator.noSpace])
  });

  auth = inject(Auth);
  hideNewPass = signal<boolean>(false);
  hideConfirmPass = signal<boolean>(false);
  matchedPass = signal<boolean>(true);
  router = inject(Router);

  toggleNewPass(event: MouseEvent) {
    this.hideNewPass.set(!this.hideNewPass());
  }

  toggleConfirmPass(event: MouseEvent) {
    this.hideConfirmPass.set(!this.hideConfirmPass());
  }

  onSubmit() {
    const newPass = this.authGroup.value.newPassword as string;
    const confirmPass = this.authGroup.value.confirmPassword as string;
    if(newPass !== confirmPass) {
      this.matchedPass.set(false);
      return;
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if(user.id) {
      this.auth.resetPassword(user.id, newPass).subscribe({
        next: (res) => {
          this.matchedPass.set(true);
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }
}
