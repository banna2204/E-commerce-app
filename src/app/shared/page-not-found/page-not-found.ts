import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  imports: [MatButtonModule],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.scss',
})
export class PageNotFound {
  private previousUrl = signal('');
  private currentUrl: string;

  constructor(private router: Router) {
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {        
        this.previousUrl.set(this.currentUrl);
        this.currentUrl = event.url;
      };
    });
  }  

  goBack() {
    const result = this.previousUrl().split('/').slice(0, 2).join('/'); 
    if(result == '/customer' || result == '/admin'){
      this.router.navigate([result]);
      console.log(result);
    }else {
      this.router.navigate(['']);
    }
  }
}
