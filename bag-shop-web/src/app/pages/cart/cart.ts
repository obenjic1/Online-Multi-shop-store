
import {
  Component,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

import { CartService } from '../../services/cart';


@Component({
  selector: 'app-cart',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './cart.html',

  styleUrl: './cart.css'
})
export class Cart {

  cartService = inject(CartService);

  cartItems = this.cartService.cartItems;

  cartCount = this.cartService.cartCount;

  cartTotal = this.cartService.cartTotal;
  shopSlug = this.cartService.shopSlug;


  increase(productId: number): void {

    this.cartService.increaseQuantity(
      productId
    );

  }


  decrease(productId: number): void {

    this.cartService.decreaseQuantity(
      productId
    );

  }


  remove(productId: number): void {

    this.cartService.removeFromCart(
      productId
    );

  }


  clear(): void {

    this.cartService.clearCart();

  }

}

