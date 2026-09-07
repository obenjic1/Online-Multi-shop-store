import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';


import { Shop } from '../../../models/shop-model';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/services/product';
import { ShopService } from '../../../services/shop-service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  private readonly shopService = inject(ShopService);
  private readonly productService = inject(ProductService);

  shop = signal<Shop | null>(null);
  products = signal<Product[]>([]);

  loadingShop = signal(true);
  loadingProducts = signal(true);

  totalProducts = computed(() => this.products().length);

  activeProducts = computed(() =>
    this.products().filter(product => product.active).length
  );

  inactiveProducts = computed(() =>
    this.products().filter(product => !product.active).length
  );

  outOfStock = computed(() =>
    this.products().filter(product => product.stockQuantity <= 0).length
  );

  ngOnInit(): void {
    this.loadShop();
    this.loadProducts();
  }

  private loadShop(): void {
    this.loadingShop.set(true);

    this.shopService.getMyShop().subscribe({
      next: shop => {
        this.shop.set(shop);
        this.loadingShop.set(false);
      },
      error: error => {
        console.error('ADMIN SHOP LOAD ERROR:', error);
        this.shop.set(null);
        this.loadingShop.set(false);
      }
    });
  }

  private loadProducts(): void {
    this.loadingProducts.set(true);

    this.productService.findAll().subscribe({
      next: products => {
        this.products.set(products ?? []);
        this.loadingProducts.set(false);
      },
      error: error => {
        console.error('ADMIN PRODUCTS LOAD ERROR:', error);
        this.products.set([]);
        this.loadingProducts.set(false);
      }
    });
  }
}
