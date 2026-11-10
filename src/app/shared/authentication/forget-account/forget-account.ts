import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CustomValidator } from '../../custom-validator/custom-validator';

@Component({
  selector: 'app-forget-account',
  imports: [MatInputModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './forget-account.html',
  styleUrl: './forget-account.scss',
})
export class ForgetAccount {
  authGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(5), CustomValidator.noSpace]),
  });

  hide = signal<boolean>(false);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit() {
    console.log(this.authGroup.value)
  }
}
