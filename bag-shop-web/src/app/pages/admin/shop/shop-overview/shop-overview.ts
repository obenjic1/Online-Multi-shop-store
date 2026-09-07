import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { ShopService } from '../../../../services/shop-service';
import { Shop } from '../../../../models/shop-model';

@Component({
  selector: 'app-shop-overview',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './shop-overview.html',
  styleUrl: './shop-overview.css'
})
export class ShopOverview implements OnInit {

  private readonly shopService = inject(ShopService);

  shop = signal<Shop | null>(null);

  loading = signal(true);

  ngOnInit(): void {
    this.loadShop();
  }

  private loadShop(): void {

    this.loading.set(true);

    this.shopService.getMyShop().subscribe({

      next: shop => {
        this.shop.set(shop);
        this.loading.set(false);
      },

      error: error => {

        console.error(
          'SHOP OVERVIEW LOAD ERROR:',
          error
        );

        this.loading.set(false);
      }

    });

  }
}
