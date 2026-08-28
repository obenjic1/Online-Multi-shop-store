import { Component, inject, OnDestroy } from '@angular/core';
import { FulfillmentType, OrderRequest } from '../../models/order';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order-service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { OrderStateService } from '../../services/order-state-service';

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  selector: 'app-checkout',
  styleUrl: './checkout.css',
  templateUrl: './checkout.html'
})
export class Checkout implements OnDestroy {

  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private orderState = inject(OrderStateService);

  private fulfillmentSubscription?: Subscription;

  cartItems = this.cartService.cartItems;
  cartTotal = this.cartService.cartTotal;

  submitting = false;
  errorMessage = '';

  checkoutForm = this.fb.group({
    fulfillmentType: [
      'PICKUP' as FulfillmentType,
      Validators.required
    ],

    customerName: [
      '',
      Validators.required
    ],

    customerPhone: [
      '',
      Validators.required
    ],

    customerEmail: [
      ''
    ],

    deliveryAddress: [
      ''
    ],

    deliveryCity: [
      ''
    ]
  });

  ngOnInit(): void {

    this.fulfillmentSubscription =
      this.checkoutForm
        .get('fulfillmentType')
        ?.valueChanges
        .subscribe(value => {

          const addressControl =
            this.checkoutForm.get('deliveryAddress');

          const cityControl =
            this.checkoutForm.get('deliveryCity');

          if (value === 'DELIVERY') {

            addressControl?.setValidators([
              Validators.required
            ]);

            cityControl?.setValidators([
              Validators.required
            ]);

          } else {

            addressControl?.clearValidators();
            cityControl?.clearValidators();

            addressControl?.setValue('');
            cityControl?.setValue('');
          }

          addressControl?.updateValueAndValidity();
          cityControl?.updateValueAndValidity();
        });
  }

  placeOrder(): void {

    if (this.checkoutForm.invalid) {

      this.checkoutForm.markAllAsTouched();

      return;
    }

    if (this.cartItems().length === 0) {

      this.errorMessage =
        'Your cart is empty. Please add a product before checkout.';

      return;
    }

    const form = this.checkoutForm.getRawValue();

    const orderRequest: OrderRequest = {

      customerName: form.customerName!,

      customerPhone: form.customerPhone!,

      customerEmail:
        form.customerEmail || undefined,

      fulfillmentType:
        form.fulfillmentType as FulfillmentType,

      deliveryAddress:
        form.fulfillmentType === 'DELIVERY'
          ? form.deliveryAddress || undefined
          : undefined,

      deliveryCity:
        form.fulfillmentType === 'DELIVERY'
          ? form.deliveryCity || undefined
          : undefined,

      items: this.cartItems().map(item => ({

        productId: item.product.id,

        quantity: item.quantity

      }))
    };

    console.log(
      'ORDER REQUEST:',
      orderRequest
    );

    this.submitting = true;
    this.errorMessage = '';

    this.orderService
      .createOrder(orderRequest)
      .subscribe({

        next: response => {

          console.log(
            'ORDER CREATED:',
            response
          );

          this.submitting = false;

          this.orderState.setOrder(response);

          this.cartService.clearCart();

          this.router.navigate([
            '/order-confirmation'
          ]);
        },

        error: error => {

          console.error(
            'ORDER ERROR:',
            error
          );

          this.submitting = false;

          this.errorMessage =
            error.error?.message ||
            'Unable to place order. Please try again.';
        }
      });
  }

  ngOnDestroy(): void {

    this.fulfillmentSubscription?.unsubscribe();

  }
}
