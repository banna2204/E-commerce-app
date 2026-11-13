import { Component, computed, inject, signal } from '@angular/core';
import { Product, ProductItem, WishlistItem } from '../../../shared/services/product';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { forkJoin } from 'rxjs';

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
  wishlistItems = signal<WishlistItem[]>([]);  

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
    this.loadProduct();
     this.loadCart();

    this.productService.inputValue.subscribe({
      next: (res) => {
        this.searchTerm.set(res ?? '');
        this.pageIndex.set(0);
      }
    })
  }

  loadProduct() {
    this.productService.getProducts().subscribe({
      next: (res) =>{
        this.products.set(res);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  loadCart() {
    forkJoin({
      wishlist: this.productService.getWishlist(),
      product: this.productService.getProducts()
    }).subscribe({
      next: ({ wishlist, product }) => {
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

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  onProductSelect(product: ProductItem) {
    this.router.navigate(['/customer/product-detail', product.id]);
  }

  toggleFavoriteIcon(product: ProductItem) {
    if (!product.id) return;

    const isWishlisted = product.wishlist;
    const updateWishlist = !isWishlisted;

    this.updateWishlist(updateWishlist, product.id);

    if (isWishlisted) {
      this.productService.getWishlist().subscribe((res) => {
        const found = res.find((item) => item.productId === product.id);
        if (!found?.id) return;

        this.productService.deleteWishList(found.id).subscribe({
          next: (res) => this.loadProduct(),
          error: () => this.updateWishlist(true, product.id!)
        });
      });
    } else {
      this.productService.addWishList(product.id).subscribe({
        next: (res) => this.loadProduct(),
        error: () => this.updateWishlist(false, product.id!) 
      });
    }
  }

  updateWishlist(wishlist: boolean, id: string){
    this.productService.updateWishlist(wishlist,id).subscribe({
      next: (res) => {
        this.wishlistItems.update((list) => 
          list.map((p) => (p.id === id) ? {...p, wishlist: res?.wishlist ?? wishlist} : p)
        )
      },
      error: (err) => console.log(err)
    })
  }

  addToCart(product: ProductItem) {
    this.productService.addToCart(product.id).subscribe({
      error: (err) => console.log(err)
    });
  }
}
