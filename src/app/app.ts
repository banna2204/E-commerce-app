import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth } from './shared/services/auth';
import { Login } from './shared/authentication/login/login';
import { Registration } from './shared/authentication/registration/registration';
import { ResetPassword } from './shared/authentication/reset-password/reset-password';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Login, Registration, ResetPassword],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('project');
  userService = inject(Auth);

  ngOnInit() {
    this.userService.getUser().subscribe(user=>{
      console.log(user)
    })
  }
}
