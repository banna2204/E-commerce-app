import { Component, computed, inject, signal } from '@angular/core';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { Product, ProductItem, WishlistItem } from '../../../shared/services/product';
import { MatButtonModule } from '@angular/material/button';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  imports: [MatPaginatorModule, MatButtonModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export class Wishlist {
  productService = inject(Product);
  products = signal<ProductItem[]>([]);
  productIds = signal<WishlistItem[]>([]);
  wishlistItems = signal<ProductItem[]>([]);

  ngOnInit() {
      this.loadCart();
    }

  loadCart() {
    forkJoin({
      wishlist: this.productService.getWishlist(),
      product: this.productService.getProducts()
    }).subscribe({
      next: ({ wishlist, product }) => {
        this.productIds.set(wishlist);
        this.products.set(product);

        const idSet = new Set(wishlist.map((item) => item.productId));

        const filteredProducts = product.filter(
          (item) => item.id && idSet.has(item.id)
        );

        this.wishlistItems.set(filteredProducts);
      },
      error: (err) => console.error(err)
    });
  }

  addToCart(product: ProductItem) {
    this.productService.addToCart(product?.id).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log(err)
    });
  }
}
