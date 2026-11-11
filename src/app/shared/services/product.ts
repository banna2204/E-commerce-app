import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

export interface categoryItem {
  id?: string,
  name: string,
  slug: string,
  description: string,
  image: string,
}

export interface ProductItem{
  id?: string,
  title: string,
  slug: string,
  price: number,
  categoryId: number,
  image: string,
  stock: number,
  rating: number,
  brand: string
}

@Injectable({
  providedIn: 'root',
})
export class Product {
  http = inject(HttpClient);
  apiUrl = 'http://localhost:3000';

  inputData = new BehaviorSubject<string>('');
  inputValue = this.inputData.asObservable();

  getCategories(): Observable<categoryItem[]>{
    return this.http.get<categoryItem[]>(`${this.apiUrl}/categories`);
  }

  getProducts(): Observable<ProductItem[]>{
    return this.http.get<ProductItem[]>(`${this.apiUrl}/products`);
  }

  getProductsOnCategory(id: number): Observable<ProductItem[]>{
    return this.http.get<ProductItem[]>(`${this.apiUrl}/products`).pipe(
      map((items)=> items.filter((item)=> item.categoryId === id))
    );
  }

  getCategoryById(id: string): Observable<categoryItem | undefined>{
    return this.http.get<categoryItem[]>(`${this.apiUrl}/categories`).pipe(
      map((items)=> items.find((item)=> item.id === id))
    );
  }

  getProductById(id: string): Observable<ProductItem | undefined>{
    return this.http.get<ProductItem[]>(`${this.apiUrl}/products`).pipe(
      map((items) => items.find((item) => item.id == id))
    )
  }
}
