import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  ShopRequest,
  ShopService
} from '../../../../services/shop-service';

import { Shop } from '../../../../models/shop-model';

@Component({
  selector: 'app-shop-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './shop-edit.html',
  styleUrl: './shop-edit.css'
})
export class ShopEdit implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly shopService = inject(ShopService);
  private readonly router = inject(Router);

  shop = signal<Shop | null>(null);

  loading = signal(true);
  saving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  shopForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],

    description: ['', [Validators.maxLength(1000)]],

    logo: [''],

    banner: [''],

    themeColor: ['#6E3B5E'],

    accentColor: ['#D96C86'],

    phoneNumber: [''],

    whatsappNumber: [''],

    email: ['', [Validators.email]],

    address: [''],

    city: [''],

    region: [''],

    landmark: [''],

    pickupAvailable: [true],

    deliveryAvailable: [true],

    deliveryFee: [0]
  });

  ngOnInit(): void {
    this.loadShop();
  }

  private loadShop(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.shopService.getMyShop().subscribe({

      next: shop => {

        this.shop.set(shop);

        this.shopForm.patchValue({
          name: shop.name ?? '',
          description: shop.description ?? '',
          logo: shop.logo ?? '',
          banner: shop.banner ?? '',
          themeColor: shop.themeColor ?? '#6E3B5E',
          accentColor: shop.accentColor ?? '#D96C86',
          phoneNumber: shop.phoneNumber ?? '',
          whatsappNumber: shop.whatsappNumber ?? '',
          email: shop.email ?? '',
          address: shop.address ?? '',
          city: shop.city ?? '',
          region: shop.region ?? '',
          landmark: shop.landmark ?? '',
          pickupAvailable: shop.pickupAvailable ?? true,
          deliveryAvailable: shop.deliveryAvailable ?? true,
          deliveryFee: shop.deliveryFee ?? 0
        });

        this.loading.set(false);
      },

      error: error => {

        console.error('SHOP EDIT LOAD ERROR:', error);

        this.errorMessage.set(
          'Unable to load your shop information.'
        );

        this.loading.set(false);
      }
    });
  }

  saveChanges(): void {

    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.shopForm.invalid) {

      this.shopForm.markAllAsTouched();

      return;
    }

    const currentShop = this.shop();

    if (!currentShop) {
      return;
    }

    this.saving.set(true);

    const request: ShopRequest = {
      ...this.shopForm.getRawValue(),

      ownerId: currentShop.ownerId
    };

    this.shopService.updateMyShop(request).subscribe({

      next: updatedShop => {

        this.shop.set(updatedShop);

        this.successMessage.set(
          'Your shop information has been updated successfully.'
        );

        this.saving.set(false);

        setTimeout(() => {
          this.router.navigate(['/admin/shop']);
        }, 800);
      },

      error: error => {

        console.error('SHOP UPDATE ERROR:', error);

        this.errorMessage.set(
          error?.error?.message ||
          'Unable to update your shop. Please try again.'
        );

        this.saving.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/shop']);
  }

  get name() {
    return this.shopForm.controls.name;
  }

  get email() {
    return this.shopForm.controls.email;
  }
}
