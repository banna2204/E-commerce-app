import { Component, computed, inject, signal } from '@angular/core';
import { categoryItem, Product, ProductItem } from '../../../shared/services/product';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-category-detail',
  imports: [MatPaginatorModule],
  templateUrl: './category-detail.html',
  styleUrl: './category-detail.scss',
})
export class CategoryDetail {
  router = inject(Router);
  products = signal<ProductItem[]>([]);
  productService = inject(Product);
  activeRouter = inject(ActivatedRoute);
  categoryName = signal<string | undefined>('');

  pageIndex = signal(0);
  pageSize = signal(5);
  paginatedProducts = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.products().slice(start, start + this.pageSize());
  });

  ngOnInit(){
    this.activeRouter.paramMap.subscribe(params=>{
      let id = Number(params.get('id'));
      this.productService.getProductsOnCategory(id).subscribe({
        next: (res) =>{
          this.products.set(res);
        },
        error: (err) => {
          console.log(err);
        }
      })
      
      this.productService.getCategoryById(id.toString()).subscribe({
        next: (res) => {
          this.categoryName.set(res?.name);
        },
        error: (err) => {
          console.log(err);
        }
      })
    })
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  onCategoryProduct(product: ProductItem) {
    this.router.navigate(['/customer/product-detail', product.id]);
  }
}
