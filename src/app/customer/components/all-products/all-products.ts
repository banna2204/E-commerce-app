import { Component, computed, inject, signal } from '@angular/core';
import { Product, ProductItem, WishlistItem } from '../../../shared/services/product';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-all-products',
  imports: [MatPaginatorModule, MatIconModule, MatButtonModule],
  templateUrl: './all-products.html',
  styleUrl: './all-products.scss',
})
export class AllProducts {
  router = inject(Router);
  productService = inject(Product);
  products = signal<ProductItem[]>([]);
  wishlistProducts = signal<WishlistItem | undefined>(undefined);

  searchTerm = signal('');
  pageIndex = signal(0);
  pageSize = signal(5);

  filteredProducts = computed(() => {
    const data = this.searchTerm().trim().toLowerCase();
    return this.products().filter(p => 
      [p.title, p.brand, p.slug]
      .some(value => value.toLowerCase().includes(data))
    );
  })

  paginatedProducts = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredProducts().slice(start, start + this.pageSize());
  });

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (res) =>{
        this.products.set(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
    
    this.products.set(this.products().map(item => ({
      ...item,
      wishlist: false,
    })));

    this.productService.inputValue.subscribe({
      next: (res) => {
        this.searchTerm.set(res ?? '');
        this.pageIndex.set(0);
      }
    })
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  onProductSelect(product: ProductItem) {
    this.router.navigate(['/customer/product-detail', product.id]);
  }

  toggleFavoriteIcon(product: ProductItem) {
    if(product.wishlist === true) {
      product.wishlist = false;
      this.productService.getWishlist().subscribe((res) => {
        const items = res.find(
          (item) => item.productId === product.id
        );

        this.wishlistProducts.set(items);
      })

      if (!this.wishlistProducts()) return;
      this.productService.deleteWishList(this.wishlistProducts()?.id).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      product.wishlist = true;
      this.productService.addWishList(product.id).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  addToCart(product: ProductItem) {
    this.productService.addToCart(product.id).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log(err)
    });
  }
}
