import { computed, Service, signal } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/product.model';

@Service()
export class CartService {

  private readonly CART_KEY = 'bag-shop-cart';

  private _cartItems = signal<CartItem[]>(
    this.loadCart()
  );

  readonly cartItems = this._cartItems.asReadonly();

  readonly cartCount = computed(() =>
    this._cartItems().reduce(
      (total, item) => total + item.quantity,
      0
    )
  );

  readonly cartTotal = computed(() =>
    this._cartItems().reduce(
      (total, item) =>
        total + item.product.price * item.quantity,
      0
    )
  );

  private loadCart(): CartItem[] {

    const saved = localStorage.getItem(this.CART_KEY);

    return saved ? JSON.parse(saved) : [];
  }

  private saveCart(): void {

    localStorage.setItem(
      this.CART_KEY,
      JSON.stringify(this._cartItems())
    );
  }

  addToCart(
    product: Product,
    quantity: number = 0
  ): void {

    const items = this._cartItems();

    const existing = items.find(
      item => item.product.id === product.id
    );

    if (existing) {

      const newQuantity =
        existing.quantity + quantity;

      // Don't exceed available stock
      const finalQuantity = Math.min(
        newQuantity,
        product.stockQuantity
      );

      this._cartItems.set(
        items.map(item =>
          item.product.id === product.id
            ? {
              ...item,
              quantity: finalQuantity
            }
            : item
        )
      );

    } else {

      // Don't add more than available stock
      const finalQuantity = Math.min(
        quantity,
        product.stockQuantity
      );

      this._cartItems.set([
        ...items,
        {
          product,
          quantity: finalQuantity
        }
      ]);
    }

    this.saveCart();
  }

  increaseQuantity(productId: number): void {

    this._cartItems.update(items =>
      items.map(item => {

        if (item.product.id !== productId) {
          return item;
        }

        // Stop at available stock
        if (
          item.quantity >=
          item.product.stockQuantity
        ) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1
        };
      })
    );

    this.saveCart();
  }

  decreaseQuantity(productId: number): void {

    this._cartItems.update(items =>
      items
        .map(item =>
          item.product.id === productId
            ? {
              ...item,
              quantity: item.quantity - 1
            }
            : item
        )
        .filter(item => item.quantity > 0)
    );

    this.saveCart();
  }

  removeFromCart(productId: number): void {

    this._cartItems.update(items =>
      items.filter(
        item => item.product.id !== productId
      )
    );

    this.saveCart();
  }

  clearCart(): void {

    this._cartItems.set([]);

    localStorage.removeItem(this.CART_KEY);
  }
}
