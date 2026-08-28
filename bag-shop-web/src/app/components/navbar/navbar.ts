import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLink,
    RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {

  private cartService = inject(CartService);

  cartCount = this.cartService.cartCount;
}
