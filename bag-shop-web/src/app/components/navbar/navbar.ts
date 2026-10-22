import { Component, inject, OnInit, signal } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  ActivatedRoute,
  Router,
  NavigationEnd
} from '@angular/router';

import { ShopService } from '../../services/shop-service';
import { PublicCategoryService, PublicCategory } from '../../services/public/public-category';
import { CartService } from '../../services/cart';
import { PublicShop } from '../../models/shop-model';
import { filter } from 'rxjs';

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
  private router = inject(Router);

  cartCount = this.cartService.cartCount;

  categories = signal<PublicCategory[]>([]);

  shopSlug = signal<string | null>(null);
  shop = signal<PublicShop | null>(null);

  shopThemeColor = signal('#6E3B5E');

  shopAccentColor = signal('#D96C86');


  loadingCategories = signal(false);

  ngOnInit(): void {

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {

        const slug = this.findShopSlug();

        this.shopSlug.set(slug);

        this.loadCategories(slug);
      });
  }

  private findShopSlug(): string | null {
    const url = this.router.url;

    console.log('FINDING SHOP FROM URL:', url);

    const match = url.match(/^\/shop\/([^/]+)/);

    if (match) {
      console.log('FOUND SHOP SLUG:', match[1]);
      return match[1];
    }

    return null;
  }

  private loadCategories(slug: string | null): void {

    this.loadingCategories.set(true);

    if (slug) {

      this.shopService.getShopPage(slug).subscribe({

        next: response => {

          this.shop.set(response.shop ?? null);
          console.log(this.shop());

          this.categories.set(
            response.categories ?? []
          );

          this.shopThemeColor.set(
            response.shop?.themeColor || '#6E3B5E'
          );

          this.shopAccentColor.set(
            response.shop?.accentColor || '#D96C86'
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


    /* NO SHOP */

    this.shopThemeColor.set('#6E3B5E');

    this.shopAccentColor.set('#D96C86');



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
