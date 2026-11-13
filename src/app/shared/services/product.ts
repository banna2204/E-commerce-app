import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, forkJoin, map, Observable, switchMap } from 'rxjs';

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
  brand: string,
  wishlist?: boolean,
  quantity: number
}

export interface cartItem{
  cartId: string,
  id?: string,
}

export interface WishlistItem {
  productId?: string,
  id?: string,
}

export interface Address {
  id?: string,
  address: string,
  name: string,
  phone: number
}

export interface Order {
  id?: string,
  orderId: string,
  addressId: string
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

  addWishList(id?:string): Observable<WishlistItem>{
    return this.http.get<WishlistItem[]>(`${this.apiUrl}/wishlist`).pipe(
      switchMap((items) => {
        const exists = items.some((i) => i?.productId === id);
        
        if (!exists) {
          return this.http.post<WishlistItem>(`${this.apiUrl}/wishlist`, {
            productId: id,
          });
        }
        return EMPTY;
      })
    );
  }

  getWishlist(): Observable<WishlistItem[]>{
    return this.http.get<WishlistItem[]>(`${this.apiUrl}/wishlist`);
  }

  deleteWishList(productId?: string): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/wishlist/${productId}`);
  }

  updateWishlist(wishlist: boolean, id: string): Observable<ProductItem | null> {
    return this.http.patch<ProductItem>(`${this.apiUrl}/products/${id}`, {
      wishlist: wishlist
    })
  }

  getCart(): Observable<cartItem[]>{
    return this.http.get<cartItem[]>(`${this.apiUrl}/carts`);
  }

  addToCart(id?:string): Observable<cartItem[] | null>{
    return this.http.get<cartItem[]>(`${this.apiUrl}/carts`).pipe(
      switchMap((items) => {
        const exists = items.some((i) => i?.cartId === id);
        
        if (!exists) {
          return this.http.post<cartItem[]>(`${this.apiUrl}/carts`, {cartId: id});
        }
        
        return EMPTY;
      })
    );
  }

  deleteCart(cartId?:string): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/carts/${cartId}`);
  }

  deleteAllCartItems(): Observable<void[]>{
    return this.http.get<cartItem[]>(`${this.apiUrl}/carts`).pipe(
      switchMap((items) => {
        if(!items || items.length == 0) {
          return [];
        }

        const deleteRequests = items.map((item) => this.http.delete<void>(`${this.apiUrl}/carts/${item.id}`));
         
        return forkJoin(deleteRequests);
      })
    )
  }

  updateQuantity(quantity: number, id: string): Observable<ProductItem | null> {
    return this.http.patch<ProductItem>(`${this.apiUrl}/products/${id}`, {
      quantity: quantity
    });
  }

  getAddress(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.apiUrl}/address`);
  }

  addAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(`${this.apiUrl}/address`, address);
  }

  deleteAddress(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/address/${id}`);
  }

  placedOrder(items: ProductItem[], addressId: string): Observable<Order[]> {
    const request = items.map((item) => this.http.post<Order>(`${this.apiUrl}/orders`, {
     orderId: item.id,
     addressId: addressId
    }))
    return forkJoin(request);
  }

  getOrders(): Observable<Order[]>{
    return this.http.get<Order[]>(`${this.apiUrl}/orders`);
  }
}
