import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-forget-account',
  imports: [MatInputModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './forget-account.html',
  styleUrl: './forget-account.scss',
})
export class ForgetAccount {
  authGroup = new FormGroup({
    email: new FormControl(''),
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
