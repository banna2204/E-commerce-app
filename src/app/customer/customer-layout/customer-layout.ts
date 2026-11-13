import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Product } from '../../shared/services/product';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-customer-layout',
  imports: [RouterOutlet, MatIconModule, MatInputModule, RouterLink, MatButtonModule],
  templateUrl: './customer-layout.html',
  styleUrl: './customer-layout.scss',
})
export class CustomerLayout {
  product = inject(Product);

  onInput(event: Event){
    const data = (event.target as HTMLInputElement).value;
    this.product.inputData.next(data);
  }
}
