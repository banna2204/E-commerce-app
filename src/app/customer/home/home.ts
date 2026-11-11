import { Component, inject, signal } from '@angular/core';
import { Product, categoryItem, ProductItem } from '../../shared/services/product';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  productService = inject(Product);
  categories = signal<categoryItem[] | null>(null);
  products = signal<ProductItem[] | null>(null);

  ngOnInit() {
    this.productService.getCategories().subscribe({
      next: (res) =>{
        const slicedData = res.slice(0,10);
        this.categories.set(slicedData);
      },
      error: (err) => {
        console.log('home product error')
      }
    });

    this.productService.getProducts().subscribe({
      next: (res) =>{
        const slicedData = res.slice(0,10);
        this.products.set(slicedData);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
