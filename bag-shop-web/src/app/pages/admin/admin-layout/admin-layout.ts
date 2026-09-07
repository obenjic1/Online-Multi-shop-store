import { Component, inject, signal } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import { ShopService } from '../../../services/shop-service';
import { Shop } from '../../../models/shop-model';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {

  private readonly shopService = inject(ShopService);

  shop = signal<Shop | null>(null);

  sidebarOpen = signal(false);

  constructor() {
    this.loadShop();
  }


  // =========================================================
  // SHOP
  // =========================================================

  private loadShop(): void {

    this.shopService.getMyShop().subscribe({

      next: shop => {
        this.shop.set(shop);
      },

      error: error => {
        console.error(
          'ADMIN LAYOUT SHOP LOAD ERROR:',
          error
        );
      }

    });

  }


  // =========================================================
  // MOBILE SIDEBAR
  // =========================================================

  toggleSidebar(): void {
    this.sidebarOpen.update(open => !open);
  }


  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

}
