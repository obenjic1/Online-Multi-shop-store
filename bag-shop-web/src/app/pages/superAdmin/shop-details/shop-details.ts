import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core'; import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from '../../../services/shop-service';
import { Shop } from '../../../models/shop-model';
import { FileService } from '../../../services/services/file-service';

@Component({
  selector: 'app-shop-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-details.html',
  styleUrl: './shop-details.css'
})
export class ShopDetails implements OnInit {
  retry() {
    throw new Error('Method not implemented.');
  }

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly shopService = inject(ShopService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly imageUrlService = inject(FileService);


  shop: Shop | null = null;

  loading = true;
  error = false;

  ngOnInit(): void {

    console.log('SHOP DETAILS COMPONENT INITIALIZED');

    const idParam = this.route.snapshot.paramMap.get('id');

    console.log('ID PARAM:', idParam);

    const id = Number(idParam);

    console.log('SHOP ID:', id);

    if (!idParam || Number.isNaN(id) || id <= 0) {
      console.error('INVALID SHOP ID');

      this.loading = false;
      this.error = true;

      return;
    }

    this.loadShop(id);
  }

  loadShop(id: number): void {

    console.log('CALLING getShopById:', id);

    this.loading = true;
    this.error = false;
    this.shop = null;

    this.shopService.getShopById(id).subscribe({

      next: (response) => {

        console.log('RESPONSE RECEIVED:', response);

        this.shop = response;
        this.loading = false;
        this.error = false;

        this.cdr.detectChanges();

        console.log('VIEW UPDATED:', {
          shop: this.shop,
          loading: this.loading,
          error: this.error
        });
        this.cdr.detectChanges();

      }
    });
  }

  goBack(): void {
    this.router.navigate(['/super-admin/shops']);
  }

  editShop(): void {

    if (!this.shop) {
      return;
    }

    this.router.navigate([
      '/super-admin/shops',
      this.shop.id,
      'edit'
    ]);
  }

  getShopInitial(): string {

    if (!this.shop?.name) {
      return 'S';
    }

    return this.shop.name.charAt(0).toUpperCase();
  }

  getDeliveryText(): string {

    if (!this.shop) {
      return 'Not available';
    }

    if (
      this.shop.pickupAvailable &&
      this.shop.deliveryAvailable
    ) {
      return 'Pickup & Delivery';
    }

    if (this.shop.pickupAvailable) {
      return 'Pickup only';
    }

    if (this.shop.deliveryAvailable) {
      return 'Delivery only';
    }

    return 'Not available';
  }

  formatDeliveryFee(): string {

    if (
      this.shop?.deliveryFee === undefined ||
      this.shop.deliveryFee === null
    ) {
      return 'Not specified';
    }

    return `${this.shop.deliveryFee.toLocaleString()} FCFA`;
  }


  getStatusClass(): string {

    return this.shop?.active
      ? 'status-active'
      : 'status-inactive';
  }
}



