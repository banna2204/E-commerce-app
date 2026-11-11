import { Component, computed, inject, signal } from '@angular/core';
import { Product, categoryItem, ProductItem } from '../../../shared/services/product';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-categories',
  imports: [MatPaginatorModule],
  templateUrl: './all-categories.html',
  styleUrl: './all-categories.scss',
})
export class AllCategories {
  productService = inject(Product);
  router = inject(Router);
  searchTerm = signal('');
  categories = signal<categoryItem[]>([]);
  pageIndex = signal(0);
  pageSize = signal(5);

  filteredCategory = computed(() => {
    const data = this.searchTerm().trim().toLowerCase();
    return this.categories().filter(p => 
      [p.name, p.slug]
      .some(value => value.toLowerCase().includes(data))
    );
  })

  paginatedCategories = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredCategory().slice(start, start + this.pageSize());
  });

  ngOnInit() {
    this.productService.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res);
      },
      error: (err) => {
        console.log('home product error')
      }
    });

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

  onCategoryDetail(category: categoryItem){
    this.router.navigate(['/customer/category-detail', category.id]);
  }
}
