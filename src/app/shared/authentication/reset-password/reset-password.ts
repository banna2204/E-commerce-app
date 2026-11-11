import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomValidator } from '../../custom-validator/custom-validator';
import { Auth } from '../../services/auth';

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

  toggleNewPass(event: MouseEvent) {
    this.hideNewPass.set(!this.hideNewPass());
    event.stopPropagation();
  }

  toggleConfirmPass(event: MouseEvent) {
    this.hideConfirmPass.set(!this.hideConfirmPass());
    event.stopPropagation();
  }

  onSubmit() {
    const newPass = this.authGroup.value.newPassword;
    const confirmPass = this.authGroup.value.confirmPassword;
    if(newPass !== confirmPass) {
      this.matchedPass.set(false);
      return;
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const newPassword = this.authGroup.value.newPassword as string;
    if(user.id) {
      this.auth.resetPassword(user.id, newPassword).subscribe({
        next: (res) => {
          this.matchedPass.set(true);
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }
}
