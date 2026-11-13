import { Component, inject, signal } from '@angular/core';
import { Address, cartItem, Product, ProductItem } from '../../../shared/services/product';
import { forkJoin } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddressDialog } from '../address-dialog/address-dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';


@Component({
  selector: 'app-checkout',
  imports: [MatButtonModule, MatIconModule, MatRadioModule, FormsModule, MatCardModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  productService = inject(Product);
  products = signal<ProductItem[]>([]);
  cartIds = signal<cartItem[]>([]);
  cartItems = signal<ProductItem[]>([]);
  totalAmount = signal<number>(0);
  address = signal<Address[]>([]);
  dialog = inject(MatDialog);
  selectedAddressId = signal<string>('');
  router = inject(Router);

  paymentMethod = [
    {
      icon: 'credit_card',
      title: 'Credit Card'
    },
    {
      icon: 'wallet',
      title: 'Wallets'
    },
    {
      icon: 'local_atm',
      title: 'UPI'
    },
    {
      icon: 'currency_rupee',
      title: 'Case on Delivery'
    },
  ]

  ngOnInit() {
    this.loadCart();
    this.loadAddress();
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

  loadAddress() {
    this.productService.getAddress().subscribe({
      next: (res) => this.address.set(res),
      error: (err) => console.log(err)
    });
  }

  addAddress() {
    const dialogRef =  this.dialog.open(AddressDialog,{
      width: '400px',
      height: '300px',
      panelClass: 'dialog'
    });

    dialogRef.afterClosed().subscribe(res => {
      this.loadAddress();
    })
  }

  onAddressDelete(id: string) {
    this.productService.deleteAddress(id).subscribe({
      next: (res) => this.loadAddress(),
      error: (err) => console.log(err)
    })
  }

  placeOrder() {
    this.productService.placedOrder(this.cartItems(), this.selectedAddressId()).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log(err)
    })
    this.router.navigate(['/customer/placed-order'])
  }

  selectedAddress(id: string) {
    this.selectedAddressId.set(id);
    console.log(this.selectedAddressId());
  }

}
