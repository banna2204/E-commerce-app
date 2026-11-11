import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Product } from '../../shared/services/product';

@Component({
  selector: 'app-customer-layout',
  imports: [RouterOutlet, MatIconModule, MatInputModule],
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
