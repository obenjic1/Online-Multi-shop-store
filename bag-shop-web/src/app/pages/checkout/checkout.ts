
import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  FulfillmentType,
  OrderRequest
} from '../../models/order';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order-service';

import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { Router, RouterLink } from '@angular/router';

import { OrderStateService } from '../../services/order-state-service';


@Component({
  selector: 'app-checkout',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './checkout.html',

  styleUrl: './checkout.css'
})
export class Checkout implements OnInit, OnDestroy {

  // =========================================================
  // SERVICES
  // =========================================================

  private fb =
    inject(FormBuilder);

  private cartService =
    inject(CartService);

  private orderService =
    inject(OrderService);

  private router =
    inject(Router);

  private orderState =
    inject(OrderStateService);


  // =========================================================
  // SUBSCRIPTION
  // =========================================================

  private fulfillmentSubscription?: Subscription;


  // =========================================================
  // CART
  // =========================================================

  cartItems =
    this.cartService.cartItems;

  cartTotal =
    this.cartService.cartTotal;


  // =========================================================
  // SHOP
  // =========================================================

  shopSlug =
    this.cartService.shopSlug;


  // =========================================================
  // MIXED SHOP VALIDATION
  // =========================================================

  /**
   * Returns the shop slug associated with each cart item.
   *
   * We first use item.shopSlug.
   * If it is missing, we fall back to product.shopSlug.
   */
  private getItemShopSlug(item: any): string | null {

    return (
      item.shopSlug ||
      item.product?.shopSlug ||
      null
    );

  }


  /**
   * Products that do not belong to the current cart shop.
   */
  readonly invalidShopItems = computed(() => {

    const currentShop =
      this.shopSlug();

    if (!currentShop) {
      return [];
    }

    return this.cartItems().filter(item => {

      const itemShopSlug =
        this.getItemShopSlug(item);

      return (
        itemShopSlug &&
        itemShopSlug !== currentShop
      );

    });

  });


  /**
   * True when the cart contains products
   * from more than one shop.
   */
  readonly hasMixedShops = computed(() => {

    const items =
      this.cartItems();

    if (items.length <= 1) {
      return false;
    }

    const shopSlugs =
      items
        .map(item =>
          this.getItemShopSlug(item)
        )
        .filter(
          slug => !!slug
        );

    return new Set(shopSlugs).size > 1;

  });


  /**
   * Returns the number of products
   * that belong to another shop.
   */
  readonly invalidShopItemCount = computed(() =>
    this.invalidShopItems().length
  );


  // =========================================================
  // UI STATE
  // =========================================================

  submitting = false;

  errorMessage = '';


  // =========================================================
  // CHECKOUT FORM
  // =========================================================

  checkoutForm =
    this.fb.group({

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


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.fulfillmentSubscription =
      this.checkoutForm
        .get('fulfillmentType')
        ?.valueChanges
        .subscribe(value => {

          const addressControl =
            this.checkoutForm.get(
              'deliveryAddress'
            );

          const cityControl =
            this.checkoutForm.get(
              'deliveryCity'
            );


          // ---------------------------------------------------
          // DELIVERY
          // ---------------------------------------------------

          if (value === 'DELIVERY') {

            addressControl?.setValidators([
              Validators.required
            ]);

            cityControl?.setValidators([
              Validators.required
            ]);

          }


          // ---------------------------------------------------
          // PICKUP
          // ---------------------------------------------------

          else {

            addressControl?.clearValidators();

            cityControl?.clearValidators();

            addressControl?.setValue('');

            cityControl?.setValue('');

          }


          addressControl?.updateValueAndValidity();

          cityControl?.updateValueAndValidity();

        });


    // ---------------------------------------------------------
    // APPLY INITIAL FULFILLMENT VALIDATION
    // ---------------------------------------------------------

    const initialFulfillment =
      this.checkoutForm
        .get('fulfillmentType')
        ?.value;

    if (initialFulfillment === 'DELIVERY') {

      const addressControl =
        this.checkoutForm.get(
          'deliveryAddress'
        );

      const cityControl =
        this.checkoutForm.get(
          'deliveryCity'
        );

      addressControl?.setValidators([
        Validators.required
      ]);

      cityControl?.setValidators([
        Validators.required
      ]);

      addressControl?.updateValueAndValidity();

      cityControl?.updateValueAndValidity();

    }

  }


  // =========================================================
  // PLACE ORDER
  // =========================================================

  placeOrder(): void {

    // ---------------------------------------------------------
    // CLEAR OLD ERROR
    // ---------------------------------------------------------

    this.errorMessage = '';


    // ---------------------------------------------------------
    // VALIDATE FORM
    // ---------------------------------------------------------

    if (this.checkoutForm.invalid) {

      this.checkoutForm.markAllAsTouched();

      return;
    }


    // ---------------------------------------------------------
    // VALIDATE CART
    // ---------------------------------------------------------

    if (this.cartItems().length === 0) {

      this.errorMessage =
        'Your cart is empty. Please add a product before checkout.';

      return;
    }


    // ---------------------------------------------------------
    // VALIDATE SHOP
    // ---------------------------------------------------------

    const currentShopSlug =
      this.shopSlug();


    if (!currentShopSlug) {

      this.errorMessage =
        'We could not determine which shop this order belongs to. Please return to the shop and try again.';

      console.error(
        'CHECKOUT ERROR: SHOP SLUG IS MISSING'
      );

      return;
    }


    // =========================================================
    // VALIDATE THAT ALL PRODUCTS BELONG TO SAME SHOP
    // =========================================================

    const invalidItems =
      this.invalidShopItems();


    if (
      this.hasMixedShops() ||
      invalidItems.length > 0
    ) {

      this.errorMessage =
        'All products in your order must be from the same shop. Please remove the highlighted product(s) before placing your order.';

      console.error(
        'CHECKOUT ERROR: CART CONTAINS PRODUCTS FROM DIFFERENT SHOPS'
      );

      console.error(
        'Expected shop:',
        currentShopSlug
      );

      console.error(
        'Invalid items:',
        invalidItems
      );

      return;
    }


    // ---------------------------------------------------------
    // VALIDATE THAT EVERY PRODUCT HAS SHOP INFORMATION
    // ---------------------------------------------------------

    const missingShopItems =
      this.cartItems().filter(item =>
        !this.getItemShopSlug(item)
      );


    if (missingShopItems.length > 0) {

      this.errorMessage =
        'We could not determine the shop for one or more products. Please remove those products from your cart and add them again from the shop.';

      console.error(
        'CHECKOUT ERROR: PRODUCTS WITHOUT SHOP INFORMATION',
        missingShopItems
      );

      return;
    }


    // ---------------------------------------------------------
    // FORM VALUES
    // ---------------------------------------------------------

    const form =
      this.checkoutForm.getRawValue();


    // ---------------------------------------------------------
    // BUILD ORDER REQUEST
    // ---------------------------------------------------------

    const orderRequest: OrderRequest = {

      shopSlug:
        currentShopSlug,

      customerName:
        form.customerName!,

      customerPhone:
        form.customerPhone!,

      customerEmail:
        form.customerEmail ||
        undefined,

      fulfillmentType:
        form.fulfillmentType as FulfillmentType,

      deliveryAddress:
        form.fulfillmentType === 'DELIVERY'
          ? form.deliveryAddress ||
          undefined
          : undefined,

      deliveryCity:
        form.fulfillmentType === 'DELIVERY'
          ? form.deliveryCity ||
          undefined
          : undefined,

      items:
        this.cartItems().map(item => ({

          productId:
            item.product.id,

          quantity:
            item.quantity

        }))

    };


    // ---------------------------------------------------------
    // DEBUG
    // ---------------------------------------------------------

    console.log(
      'SHOP SLUG:',
      currentShopSlug
    );

    console.log(
      'ORDER REQUEST:',
      orderRequest
    );


    // ---------------------------------------------------------
    // SUBMIT
    // ---------------------------------------------------------

    this.submitting = true;


    this.orderService
      .createOrder(orderRequest)
      .subscribe({

        // =====================================================
        // SUCCESS
        // =====================================================

        next: response => {

          console.log(
            'ORDER CREATED:',
            response
          );


          this.submitting = false;


          // ---------------------------------------------------
          // SAVE ORDER
          // ---------------------------------------------------

          this.orderState.setOrder(
            response
          );


          // ---------------------------------------------------
          // CLEAR CART
          // ---------------------------------------------------

          this.cartService.clearCart();


          // ---------------------------------------------------
          // GO TO CONFIRMATION
          // ---------------------------------------------------

          this.router.navigate([
            '/order-confirmation'
          ]);

        },


        // =====================================================
        // ERROR
        // =====================================================

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


  // =========================================================
  // DESTROY
  // =========================================================

  ngOnDestroy(): void {

    this.fulfillmentSubscription?.unsubscribe();

  }

}

