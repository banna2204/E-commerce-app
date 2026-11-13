import { Component, inject, signal } from '@angular/core';
import { cartItem, Product, ProductItem } from '../../../shared/services/product';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin, single } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-to-cart',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './add-to-cart.html',
  styleUrl: './add-to-cart.scss',
})
export class AddToCart {
  productService = inject(Product);
  products = signal<ProductItem[]>([]);
  cartIds = signal<cartItem[]>([]);
  cartItems = signal<ProductItem[]>([]);
  totalAmount = signal<number>(0);
  router = inject(Router);

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    forkJoin({
      cart: this.productService.getCart(),
      product: this.productService.getProducts()
    }).subscribe({
      next: ({ cart, product }) => {
        this.cartIds.set(cart);
        this.products.set(product);

        const idSet = new Set(cart.map((item) => item.cartId));

        const filteredProducts = product.filter(
          (item) => item.id && idSet.has(item.id)
        );

        const updatedProducts = filteredProducts.map((item) => ({
          ...item,
          quantity: item.quantity ?? 1
        }));

        const total = updatedProducts.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        );

        this.totalAmount.set(total);
        this.cartItems.set(updatedProducts);
      },
      error: (err) => console.error(err)
    });
  }
  
  decreaseQuantity(product: ProductItem) {
    if (!product.id || product.quantity <= 0) return;
    const updatedQuantity = product.quantity - 1;
    if (updatedQuantity > 0) {
      this.productService.updateQuantity(updatedQuantity, product.id).subscribe({
        next: (res) => {
          this.cartItems.update((list) => list.map((item) =>
            item.id === product.id ? { ...item, quantity: res?.quantity ?? updatedQuantity } : item)
          );
          this.totalAmount.update(
            (amount) => amount - product.price
          );
        },
        error: (err) => console.error(err)
      });

    } else {
      const cartItem = this.cartIds().find(
        (item) => item.cartId === product.id
      );

      if (!cartItem) return;
      this.productService.deleteCart(cartItem.id).subscribe({
        next: () => { this.totalAmount.update((amount) => amount - product.price);
          this.loadCart();
        },
        error: (err) => console.error(err)
      });
    }
  }

  increaseQuantity(product: ProductItem) {
    if (!product.id) return;
    const updatedQuantity = product.quantity + 1;
    this.productService.updateQuantity(updatedQuantity, product.id).subscribe({
      next: (res) => {
        this.cartItems.update((list) =>
          list.map((p) => p.id === product.id ? { ...p, quantity: res?.quantity ?? updatedQuantity } : p )
        );
        this.totalAmount.update((amount) => amount + product.price);
      },
      error: (err) => console.error(err)
    });
  }

  checkout() {
    this.router.navigate(['/customer/checkout'])
  }
}
