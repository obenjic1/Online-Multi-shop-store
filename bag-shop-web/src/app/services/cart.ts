
import {
  Injectable,
  computed,
  inject,
  signal
} from '@angular/core';

import { CartItem } from '../models/cart-item';

import { Product } from '../models/product.model';
import { SweetAlertService } from './sweet-alert-service';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly CART_KEY = 'bag-shop-cart';
  private sweetAlertService =
    inject(SweetAlertService);


  // =========================================================
  // SHOP CONTEXT
  // =========================================================

  private readonly _shopSlug =
    signal<string | null>(this.loadShopSlug());

  readonly shopSlug =
    this._shopSlug.asReadonly();


  // =========================================================
  // CART STATE
  // =========================================================

  private readonly _cartItems =
    signal<CartItem[]>(
      this.loadCart()
    );


  readonly cartItems =
    this._cartItems.asReadonly();


  // =========================================================
  // CART COUNT
  // =========================================================

  readonly cartCount = computed(() =>
    this._cartItems().reduce(
      (total, item) =>
        total + item.quantity,
      0
    )
  );


  // =========================================================
  // CART TOTAL
  // =========================================================

  readonly cartTotal = computed(() =>
    this._cartItems().reduce(
      (total, item) =>
        total +
        item.product.price *
        item.quantity,
      0
    )
  );


  // =========================================================
  // LOAD CART
  // =========================================================

  private loadCart(): CartItem[] {

    try {

      const saved =
        localStorage.getItem(
          this.CART_KEY
        );

      if (!saved) {
        return [];
      }

      return JSON.parse(saved);

    } catch (error) {

      console.error(
        'ERROR LOADING CART:',
        error
      );

      return [];

    }

  }


  // =========================================================
  // LOAD SHOP SLUG
  // =========================================================

  private loadShopSlug(): string | null {

    try {

      return localStorage.getItem(
        `${this.CART_KEY} -shop`
      );

    } catch (error) {

      console.error(
        'ERROR LOADING CART SHOP:',
        error
      );

      return null;

    }

  }


  // =========================================================
  // SAVE CART
  // =========================================================

  private saveCart(): void {

    localStorage.setItem(
      this.CART_KEY,
      JSON.stringify(
        this._cartItems()
      )
    );

  }


  // =========================================================
  // SAVE SHOP
  // =========================================================

  private saveShopSlug(
    shopSlug: string | null
  ): void {

    if (shopSlug) {

      localStorage.setItem(
        `${this.CART_KEY} -shop`,
        shopSlug
      );

    } else {

      localStorage.removeItem(
        `${this.CART_KEY} -shop`
      );

    }

  }


  // =========================================================
  // ADD TO CART
  // =========================================================


  addToCart(
    product: Product,
    quantity: number,
    shopSlug: string | null
  ): boolean {

    // -------------------------------------------------------
    // INVALID QUANTITY / STOCK
    // -------------------------------------------------------

    if (
      quantity <= 0 ||
      product.stockQuantity <= 0
    ) {

      return false;

    }


    // -------------------------------------------------------
    // SHOP SLUG IS REQUIRED
    // -------------------------------------------------------

    if (!shopSlug) {

      this.sweetAlertService.warning(
        'Shop Not Found',
        'We could not determine which shop this product belongs to.'
      );

      return false;

    }


    const currentShop =
      this._shopSlug();


    // =======================================================
    // DIFFERENT SHOP
    // =======================================================

    if (
      currentShop &&
      currentShop !== shopSlug
    ) {

      this.sweetAlertService.warning(
        'Different Shop',
        'Your cart already contains products from another shop. Please clear your cart before shopping from this shop.'
      );

      return false;

    }


    // =======================================================
    // SET SHOP
    // =======================================================

    if (!currentShop) {

      this._shopSlug.set(
        shopSlug
      );

      this.saveShopSlug(
        shopSlug
      );

    }


    // =======================================================
    // GET CURRENT ITEMS
    // =======================================================

    const items =
      this._cartItems();


    // =======================================================
    // FIND EXISTING PRODUCT
    // =======================================================

    const existing =
      items.find(
        item =>
          item.product.id ===
          product.id
      );


    // =======================================================
    // PRODUCT ALREADY EXISTS
    // =======================================================

    if (existing) {

      const newQuantity =
        existing.quantity +
        quantity;


      const finalQuantity =
        Math.min(
          newQuantity,
          product.stockQuantity
        );


      this._cartItems.set(

        items.map(item =>

          item.product.id ===
            product.id

            ? {

              ...item,

              product,

              quantity:
                finalQuantity,

              shopSlug

            }

            : item

        )

      );

    }


    // =======================================================
    // NEW PRODUCT
    // =======================================================

    else {

      const finalQuantity =
        Math.min(
          quantity,
          product.stockQuantity
        );


      this._cartItems.set([

        ...items,

        {

          product,

          quantity:
            finalQuantity,

          shopSlug

        }

      ]);

    }


    // =======================================================
    // SAVE CART
    // =======================================================

    this.saveCart();

    return true;

  }




  // =========================================================
  // INCREASE QUANTITY
  // =========================================================

  increaseQuantity(
    productId: number
  ): void {

    this._cartItems.update(
      items =>

        items.map(item => {

          if (
            item.product.id !==
            productId
          ) {

            return item;

          }


          if (
            item.quantity >=
            item.product.stockQuantity
          ) {

            return item;

          }


          return {

            ...item,

            quantity:
              item.quantity + 1

          };

        })

    );


    this.saveCart();

  }


  // =========================================================
  // DECREASE QUANTITY
  // =========================================================

  decreaseQuantity(
    productId: number
  ): void {

    this._cartItems.update(
      items =>

        items
          .map(item =>

            item.product.id ===
              productId

              ? {

                ...item,

                quantity:
                  item.quantity - 1

              }

              : item

          )

          .filter(
            item =>
              item.quantity > 0
          )

    );


    this.saveCart();


    // If the cart became empty,
    // remove the shop context too.

    if (this._cartItems().length === 0) {

      this.clearShop();

    }

  }


  // =========================================================
  // REMOVE
  // =========================================================

  removeFromCart(
    productId: number
  ): void {

    this._cartItems.update(
      items =>

        items.filter(
          item =>
            item.product.id !==
            productId
        )

    );


    this.saveCart();


    // Clear shop when cart becomes empty.

    if (this._cartItems().length === 0) {

      this.clearShop();

    }

  }


  // =========================================================
  // CLEAR CART
  // =========================================================

  clearCart(): void {

    this._cartItems.set([]);

    localStorage.removeItem(
      this.CART_KEY
    );

    this.clearShop();

  }


  // =========================================================
  // CLEAR SHOP
  // =========================================================

  private clearShop(): void {

    this._shopSlug.set(null);

    this.saveShopSlug(null);

  }

}

