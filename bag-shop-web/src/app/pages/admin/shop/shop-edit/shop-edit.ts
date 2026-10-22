import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  ShopRequest,
  ShopService
} from '../../../../services/shop-service';

import { Shop } from '../../../../models/shop-model';
import { FileService } from '../../../../services/services/file-service';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-shop-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './shop-edit.html',
  styleUrl: './shop-edit.css'
})
export class ShopEdit implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly shopService = inject(ShopService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly imageUrlService = inject(FileService);


  /* =====================================================
     STATE
  ====================================================== */

  shop = signal<Shop | null>(null);

  loading = signal(true);
  saving = signal(false);

  errorMessage = signal('');
  successMessage = signal('');

  selectedLogoFile: File | null = null;
  selectedBannerFile: File | null = null;



  logoPreview: string | null = null;
  bannerPreview: string | null = null;


  /*
   * If shopId exists, we are editing from Super Admin.
   *
   * If shopId is null, we are editing the logged-in
   * administrator's own shop.
   */
  shopId = signal<number | null>(null);


  /* =====================================================
     FORM
  ====================================================== */

  shopForm = this.fb.nonNullable.group({

    name: [
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ],

    description: [
      '',
      [
        Validators.maxLength(1000)
      ]
    ],

    logo: [
      ''
    ],

    banner: [
      ''
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
      [
        Validators.email
      ]
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
      [
        Validators.min(0)
      ]
    ]
  });


  /* =====================================================
     INIT
  ====================================================== */

  ngOnInit(): void {

    const idParam =
      this.route.snapshot.paramMap.get('id');

    /*
     * Super Admin route:
     *
     * /super-admin/shops/:id/edit
     */
    if (idParam) {

      const id =
        Number(idParam);

      if (
        Number.isNaN(id) ||
        id <= 0
      ) {

        this.errorMessage.set(
          'Invalid shop ID.'
        );

        this.loading.set(false);

        return;
      }

      this.shopId.set(id);

      this.loadShopById(id);

      return;
    }


    /*
     * Admin route:
     *
     * /admin/shop/edit
     */
    this.loadMyShop();
  }


  /* =====================================================
     LOAD MY SHOP
     ====================================================== */

  private loadMyShop(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.shopService.getMyShop().subscribe({

      next: shop => {

        this.populateForm(shop);

        this.loading.set(false);
      },

      error: error => {

        console.error(
          'MY SHOP EDIT LOAD ERROR:',
          error
        );

        this.errorMessage.set(
          'Unable to load your shop information.'
        );

        this.loading.set(false);
      }
    });
  }


  /* =====================================================
     LOAD SHOP BY ID
     ====================================================== */

  private loadShopById(id: number): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.shopService.getShopById(id).subscribe({

      next: shop => {

        this.populateForm(shop);

        this.loading.set(false);
      },

      error: error => {

        console.error(
          'SHOP EDIT LOAD ERROR:',
          error
        );

        this.errorMessage.set(
          'Unable to load shop information.'
        );

        this.loading.set(false);
      }
    });
  }


  /* =====================================================
     POPULATE FORM
  ====================================================== */

  private populateForm(shop: Shop): void {

    this.shop.set(shop);

    this.shopForm.patchValue({

      name:
        shop.name ?? '',

      description:
        shop.description ?? '',

      logo:
        shop.logo ?? '',

      banner:
        shop.banner ?? '',

      themeColor:
        shop.themeColor ?? '#6E3B5E',

      accentColor:
        shop.accentColor ?? '#D96C86',

      phoneNumber:
        shop.phoneNumber ?? '',

      whatsappNumber:
        shop.whatsappNumber ?? '',

      email:
        shop.email ?? '',

      address:
        shop.address ?? '',

      city:
        shop.city ?? '',

      region:
        shop.region ?? '',

      landmark:
        shop.landmark ?? '',

      pickupAvailable:
        shop.pickupAvailable ?? true,

      deliveryAvailable:
        shop.deliveryAvailable ?? true,

      deliveryFee:
        shop.deliveryFee ?? 0
    });
  }


  /* =====================================================
     SAVE CHANGES
  ====================================================== */

  saveChanges(): void {

    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.shopForm.invalid) {

      this.shopForm.markAllAsTouched();

      return;
    }

    const currentShop =
      this.shop();

    if (!currentShop) {
      return;
    }

    this.saving.set(true);


    const value =
      this.shopForm.getRawValue();


    const request: ShopRequest = {

      name:
        value.name,

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

      /*
       * Keep the existing owner.
       */
      ownerId:
        currentShop.ownerId
    };


    const formData =
      new FormData();


    formData.append(
      'shop',
      new Blob(
        [
          JSON.stringify(request)
        ],
        {
          type: 'application/json'
        }
      )
    );


    if (this.selectedLogoFile) {

      formData.append(
        'logoFile',
        this.selectedLogoFile
      );
    }


    if (this.selectedBannerFile) {

      formData.append(
        'bannerFile',
        this.selectedBannerFile
      );
    }


    /*
     * ================================================
     * SUPER ADMIN
     * ================================================
     */

    if (this.shopId()) {

      this.shopService.updateShop(
        this.shopId()!,
        formData
      ).subscribe({

        next: updatedShop => {

          this.shop.set(updatedShop);

          this.saving.set(false);

          Swal.fire({
            icon: 'success',
            title: 'Shop Updated',
            text:
              `${updatedShop.name} has been updated successfully.`,
            confirmButtonText: 'Done'
          }).then(() => {

            this.router.navigate([
              '/super-admin/shops',
              updatedShop.id
            ]);

          });
        },

        error: error => {

          console.error(
            'SUPER ADMIN SHOP UPDATE ERROR:',
            error
          );

          this.saving.set(false);

          this.errorMessage.set(
            error?.error?.message ||
            'Unable to update the shop. Please try again.'
          );
        }
      });

      return;
    }


    /*
     * ================================================
     * NORMAL ADMIN
     * ================================================
     */

    this.shopService.updateMyShop(
      formData
    ).subscribe({

      next: updatedShop => {

        this.shop.set(updatedShop);

        this.successMessage.set(
          'Your shop information has been updated successfully.'
        );

        this.saving.set(false);

        setTimeout(() => {

          this.router.navigate([
            '/admin/shop'
          ]);

        }, 800);
      },

      error: error => {

        console.error(
          'SHOP UPDATE ERROR:',
          error
        );

        this.errorMessage.set(
          error?.error?.message ||
          'Unable to update your shop. Please try again.'
        );

        this.saving.set(false);
      }
    });
  }


  /* =====================================================
     CANCEL
  ====================================================== */

  cancel(): void {

    if (this.shopId()) {

      this.router.navigate([
        '/super-admin/shops',
        this.shopId()
      ]);

      return;
    }

    this.router.navigate([
      '/admin/shop'
    ]);
  }


  /* =====================================================
     FILE SELECTION
  ====================================================== */

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedLogoFile = input.files[0];

      if (this.logoPreview) {
        URL.revokeObjectURL(this.logoPreview);
      }

      this.logoPreview = URL.createObjectURL(this.selectedLogoFile);
    }
  }

  onBannerSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedBannerFile = input.files[0];

      if (this.bannerPreview) {
        URL.revokeObjectURL(this.bannerPreview);
      }

      this.bannerPreview = URL.createObjectURL(this.selectedBannerFile);
    }
  }


  /* =====================================================
     VALIDATION
  ====================================================== */

  get name() {
    return this.shopForm.controls.name;
  }


  get email() {
    return this.shopForm.controls.email;
  }
}
