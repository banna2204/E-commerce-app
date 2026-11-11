import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductItem } from '../../../shared/services/product';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-detail',
  imports: [MatButtonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  router = inject(ActivatedRoute);
  productService = inject(Product);
  product = signal<ProductItem | null>(null);

  ngOnInit() {
    this.router.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.productService.getProductById(id.toString()).subscribe({
        next: (res) => {
          this.product.set(res ?? null);
        }
      })
    })
  }
}
