import { Component, inject, signal } from '@angular/core';
import { Order, Product, ProductItem } from '../../../shared/services/product';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-view-order',
  imports: [],
  templateUrl: './view-order.html',
  styleUrl: './view-order.scss',
})
export class ViewOrder {
  productService = inject(Product);
  orders = signal<ProductItem[]>([]);

  ngOnInit() {
    forkJoin({
      product: this.productService.getProducts(),
      order: this.productService.getOrders()
    }).subscribe({
      next: ({product, order}) => {
        
        const orderIds = new Set(order.map((o) => o.orderId));

        const myOrders = product.filter(
          (p) => p.id && orderIds.has(p.id)
        );

        this.orders.set(myOrders);
      }
    })
  }
}
