import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Product } from '../../../shared/services/product';

@Component({
  selector: 'app-placed-order',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './placed-order.html',
  styleUrl: './placed-order.scss',
})
export class PlacedOrder {
  router = inject(Router);
  productService = inject(Product);

  viewOrder() {
    this.productService.deleteAllCartItems().subscribe({
      error: (err) => console.log(err)
    })
    this.router.navigate(['/customer/view-order']);
  }
}
