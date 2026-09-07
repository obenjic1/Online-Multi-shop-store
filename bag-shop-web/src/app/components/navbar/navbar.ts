import { Component, inject, OnInit, signal } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  ActivatedRoute
} from '@angular/router';

import { ShopService } from '../../services/shop-service';
import { PublicCategoryService, PublicCategory } from '../../services/public/public-category';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  private cartService = inject(CartService);
  private shopService = inject(ShopService);
  private publicCategoryService = inject(PublicCategoryService);
  private route = inject(ActivatedRoute);

  cartCount = this.cartService.cartCount;

  categories = signal<PublicCategory[]>([]);

  shopSlug = signal<string | null>(null);

  loadingCategories = signal(false);

  ngOnInit(): void {

    const slug = this.findShopSlug();

    this.shopSlug.set(slug);

    this.loadCategories(slug);
  }

  private findShopSlug(): string | null {

    let route = this.route;

    while (route) {

      const slug = route.snapshot.paramMap.get('slug');

      if (slug) {
        return slug;
      }

      route = route.firstChild!;
    }

    return null;
  }

  private loadCategories(slug: string | null): void {

    this.loadingCategories.set(true);

    if (slug) {

      this.shopService.getShopPage(slug).subscribe({

        next: response => {

          this.categories.set(
            response.categories ?? []
          );

          this.loadingCategories.set(false);
        },

        error: error => {

          console.error(
            'SHOP CATEGORIES LOAD ERROR:',
            error
          );

          this.categories.set([]);

          this.loadingCategories.set(false);
        }

      });

      return;
    }

    this.publicCategoryService.findAll().subscribe({

      next: response => {

        this.categories.set(
          response ?? []
        );

        this.loadingCategories.set(false);
      },

      error: error => {

        console.error(
          'PUBLIC CATEGORIES LOAD ERROR:',
          error
        );

        this.categories.set([]);

        this.loadingCategories.set(false);
      }

    });
  }
}
