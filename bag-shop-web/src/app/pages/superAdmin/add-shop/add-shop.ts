import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import { UserService } from '../../../services/user-service';
import { ShopService } from '../../../services/shop-service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-add-shop',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './add-shop.html',
  styleUrl: './add-shop.css'
})
export class AddShop implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly shopService = inject(ShopService);
  private readonly router = inject(Router);

  /* =====================================================
     STATE
  ====================================================== */

  admins = signal<User[]>([]);

  loadingAdmins = signal(true);
  submitting = signal(false);

  logoFile = signal<File | null>(null);
  bannerFile = signal<File | null>(null);

  logoPreview = signal<string | null>(null);
  bannerPreview = signal<string | null>(null);


  /* =====================================================
     FORM
  ====================================================== */

  shopForm = this.fb.nonNullable.group({

    name: [
      '',
      [Validators.required]
    ],

    description: [
      ''
    ],

    ownerId: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    themeColor: [
      '#6E3B5E'
    ],

    accentColor: [
      '#D96C86'
    ],

    phoneNumber: [
      ''
    ],

    whatsappNumber: [
      ''
    ],

    email: [
      '',
      [Validators.email]
    ],

    address: [
      ''
    ],

    city: [
      ''
    ],

    region: [
      ''
    ],

    landmark: [
      ''
    ],

    pickupAvailable: [
      true
    ],

    deliveryAvailable: [
      true
    ],

    deliveryFee: [
      0,
      [Validators.min(0)]
    ]
  });


  /* =====================================================
     INIT
  ====================================================== */

  ngOnInit(): void {
    this.loadAvailableAdmins();
  }


  /* =====================================================
     AVAILABLE ADMINS
  ====================================================== */

  loadAvailableAdmins(): void {

    this.loadingAdmins.set(true);

    this.userService.getAvailableAdmins().subscribe({

      next: admins => {
        this.admins.set(admins);
        this.loadingAdmins.set(false);
      },

      error: error => {

        console.error(
          'AVAILABLE ADMINS LOAD ERROR:',
          error
        );

        this.admins.set([]);
        this.loadingAdmins.set(false);
      }

    });
  }


  /* =====================================================
     IMAGE SELECTION
  ====================================================== */

  onLogoSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0];

    if (!file) {
      return;
    }

    this.logoFile.set(file);

    const reader =
      new FileReader();

    reader.onload = () => {

      this.logoPreview.set(
        reader.result as string
      );

    };

    reader.readAsDataURL(file);
  }


  onBannerSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0];

    if (!file) {
      return;
    }

    this.bannerFile.set(file);

    const reader =
      new FileReader();

    reader.onload = () => {

      this.bannerPreview.set(
        reader.result as string
      );

    };

    reader.readAsDataURL(file);
  }


  removeLogo(): void {

    this.logoFile.set(null);
    this.logoPreview.set(null);

  }


  removeBanner(): void {

    this.bannerFile.set(null);
    this.bannerPreview.set(null);

  }


  /* =====================================================
     SUBMIT
  ====================================================== */

  submit(): void {

    if (this.shopForm.invalid) {

      this.shopForm.markAllAsTouched();

      return;
    }

    this.submitting.set(true);

    const value =
      this.shopForm.getRawValue();

    const request = {

      name: value.name,

      description:
        value.description || undefined,

      themeColor:
        value.themeColor || undefined,

      accentColor:
        value.accentColor || undefined,

      phoneNumber:
        value.phoneNumber || undefined,

      whatsappNumber:
        value.whatsappNumber || undefined,

      email:
        value.email || undefined,

      address:
        value.address || undefined,

      city:
        value.city || undefined,

      region:
        value.region || undefined,

      landmark:
        value.landmark || undefined,

      pickupAvailable:
        value.pickupAvailable,

      deliveryAvailable:
        value.deliveryAvailable,

      deliveryFee:
        value.deliveryAvailable
          ? value.deliveryFee
          : undefined,

      ownerId:
        value.ownerId
    };

    this.shopService.createShop(
      request,
      this.logoFile(),
      this.bannerFile()
    ).subscribe({

      next: shop => {

        console.log(
          'SHOP CREATED:',
          shop
        );

        this.submitting.set(false);

        this.router.navigate([
          '/super-admin/shops'
        ]);

      },

      error: error => {

        console.error(
          'CREATE SHOP ERROR:',
          error
        );

        this.submitting.set(false);

      }

    });
  }


  /* =====================================================
     VALIDATION HELPER
  ====================================================== */

  hasError(
    controlName: string,
    error: string
  ): boolean {

    const control =
      this.shopForm.get(controlName);

    return !!(
      control &&
      control.touched &&
      control.hasError(error)
    );
  }
}
