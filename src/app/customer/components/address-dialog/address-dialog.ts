import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidator } from '../../../shared/custom-validator/custom-validator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Address, Product } from '../../../shared/services/product';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-address-dialog',
  imports: [MatInputModule, ReactiveFormsModule, MatButtonModule, MatIconModule],
  templateUrl: './address-dialog.html',
  styleUrl: './address-dialog.scss',
})
export class AddressDialog {
  productService = inject(Product);
  dialogRef = inject(MatDialogRef);
  
  addressGroup = new FormGroup({
    address: new FormControl('', [Validators.required, Validators.minLength(8)]),
    name: new FormControl('', [Validators.required]),
    phone: new FormControl(0,[Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^\d{10}$/), CustomValidator.noSpace]),
  });

  addAddress() {
    const addressvalue = this.addressGroup.getRawValue() as Address; 
    this.productService.addAddress(addressvalue).subscribe({
      next: (res) => this.dialogRef.close(),
      error: (err) => console.log(err)
    })
  }
}
