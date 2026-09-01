
import {
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { CartService } from '../../../services/cart';

import {
  Product,
  ProductImage
} from '../../../models/product.model';

import { PublicProductService } from '../../../services/public/public-product-service';


@Component({
  selector: 'app-product-details',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './product-details.html',

  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit, OnDestroy {

  // =========================================================
  // SERVICES
  // =========================================================

  private route = inject(ActivatedRoute);

  private publicProductService =
    inject(PublicProductService);

  private cartService =
    inject(CartService);


  // =========================================================
  // PRODUCT
  // =========================================================

  product = signal<Product | null>(null);


  // =========================================================
  // SHOP CONTEXT
  // =========================================================

  shopSlug = signal<string | null>(null);


  // =========================================================
  // IMAGES
  // =========================================================

  images = signal<ProductImage[]>([]);

  selectedImage =
    signal<ProductImage | null>(null);

  currentImageIndex = signal(0);


  // =========================================================
  // UI STATE
  // =========================================================

  quantity = signal(1);

  cartMessage = signal('');

  loading = signal(true);

  errorMessage = signal('');


  // =========================================================
  // AUTO SLIDER
  // =========================================================

  private sliderInterval:
    ReturnType<typeof setInterval> | null = null;

  private readonly sliderDelay = 4500;


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    const slug =
      this.route.snapshot.paramMap.get('slug');


    // ---------------------------------------------------------
    // VALIDATE PRODUCT ID
    // ---------------------------------------------------------

    if (!id) {

      this.errorMessage.set(
        'Invalid product.'
      );

      this.loading.set(false);

      return;
    }


    // ---------------------------------------------------------
    // STORE SHOP CONTEXT
    // ---------------------------------------------------------

    this.shopSlug.set(slug);


    // ---------------------------------------------------------
    // LOAD PRODUCT
    // ---------------------------------------------------------

    if (slug) {

      // /shop/:slug/products/:id

      this.loadShopProduct(
        slug,
        id
      );

    } else {

      // /products/:id

      this.loadProduct(id);

    }

  }


  // =========================================================
  // LOAD GENERAL PUBLIC PRODUCT
  // =========================================================

  private loadProduct(id: number): void {

    this.loading.set(true);

    this.publicProductService
      .findById(id)
      .subscribe({

        next: product => {

          this.product.set(product);

          this.setProductImages(
            product.images ?? []
          );

          this.loading.set(false);

        },

        error: error => {

          console.error(
            'ERROR LOADING PRODUCT:',
            error
          );

          this.errorMessage.set(
            'Unable to load this product.'
          );

          this.loading.set(false);

        }

      });

  }


  // =========================================================
  // LOAD SHOP PRODUCT
  // =========================================================

  private loadShopProduct(
    slug: string,
    productId: number
  ): void {

    this.loading.set(true);

    this.publicProductService
      .findShopProduct(
        slug,
        productId
      )
      .subscribe({

        next: product => {

          this.product.set(product);

          this.setProductImages(
            product.images ?? []
          );

          this.loading.set(false);

        },

        error: error => {

          console.error(
            'ERROR LOADING SHOP PRODUCT:',
            error
          );

          this.errorMessage.set(
            'Unable to load this product.'
          );

          this.loading.set(false);

        }

      });

  }


  // =========================================================
  // CONVERT STRING URLS → PRODUCT IMAGE OBJECTS
  // =========================================================

  private setProductImages(
    imageUrls: string[]
  ): void {

    const productImages: ProductImage[] =
      imageUrls.map(
        (imageUrl, index) => ({

          id: index + 1,

          imageUrl,

          originalFileName: '',

          primaryImage: index === 0,

          displayOrder: index

        })
      );


    this.setImages(productImages);

  }


  // =========================================================
  // SET IMAGES
  // =========================================================

  private setImages(
    productImages: ProductImage[]
  ): void {

    this.images.set(productImages);


    // ---------------------------------------------------------
    // NO IMAGES
    // ---------------------------------------------------------

    if (productImages.length === 0) {

      this.selectedImage.set(null);

      this.currentImageIndex.set(0);

      this.stopAutoSlider();

      return;
    }


    // ---------------------------------------------------------
    // FIND PRIMARY IMAGE
    // ---------------------------------------------------------

    const primaryIndex =
      productImages.findIndex(
        image => image.primaryImage
      );


    const startIndex =
      primaryIndex >= 0
        ? primaryIndex
        : 0;


    // ---------------------------------------------------------
    // SELECT STARTING IMAGE
    // ---------------------------------------------------------

    this.currentImageIndex.set(
      startIndex
    );

    this.selectedImage.set(
      productImages[startIndex]
    );


    // ---------------------------------------------------------
    // START SLIDER
    // ---------------------------------------------------------

    this.startAutoSlider();

  }


  // =========================================================
  // SELECT IMAGE
  // =========================================================

  selectImage(
    image: ProductImage,
    index: number
  ): void {

    this.currentImageIndex.set(index);

    this.selectedImage.set(image);

    this.restartAutoSlider();

  }


  // =========================================================
  // NEXT IMAGE
  // =========================================================

  nextImage(): void {

    const productImages =
      this.images();


    if (productImages.length <= 1) {
      return;
    }


    const nextIndex =
      (
        this.currentImageIndex() + 1
      ) % productImages.length;


    this.currentImageIndex.set(
      nextIndex
    );

    this.selectedImage.set(
      productImages[nextIndex]
    );

  }


  // =========================================================
  // PREVIOUS IMAGE
  // =========================================================

  previousImage(): void {

    const productImages =
      this.images();


    if (productImages.length <= 1) {
      return;
    }


    const previousIndex =
      (
        this.currentImageIndex() -
        1 +
        productImages.length
      ) % productImages.length;


    this.currentImageIndex.set(
      previousIndex
    );

    this.selectedImage.set(
      productImages[previousIndex]
    );

  }


  // =========================================================
  // AUTO SLIDER
  // =========================================================

  private startAutoSlider(): void {

    this.stopAutoSlider();


    if (this.images().length <= 1) {
      return;
    }


    this.sliderInterval =
      setInterval(() => {

        this.nextImage();

      }, this.sliderDelay);

  }


  // =========================================================
  // RESTART AUTO SLIDER
  // =========================================================

  private restartAutoSlider(): void {

    this.startAutoSlider();

  }


  // =========================================================
  // STOP AUTO SLIDER
  // =========================================================

  private stopAutoSlider(): void {

    if (this.sliderInterval !== null) {

      clearInterval(
        this.sliderInterval
      );

      this.sliderInterval = null;

    }

  }


  // =========================================================
  // QUANTITY
  // =========================================================

  increaseQuantity(): void {

    const currentProduct =
      this.product();


    if (!currentProduct) {
      return;
    }


    if (
      this.quantity() <
      currentProduct.stockQuantity
    ) {

      this.quantity.update(
        value => value + 1
      );

    }

  }


  // =========================================================
  // DECREASE QUANTITY
  // =========================================================

  decreaseQuantity(): void {

    if (this.quantity() > 1) {

      this.quantity.update(
        value => value - 1
      );

    }

  }


  // =========================================================
  // ADD TO CART
  // =========================================================

  addToCart(): void {

    const currentProduct =
      this.product();


    if (!currentProduct) {
      return;
    }


    // ---------------------------------------------------------
    // SHOP CONTEXT
    // ---------------------------------------------------------

    const currentShopSlug =
      this.shopSlug() ??
      currentProduct.shopSlug ??
      null;


    // ---------------------------------------------------------
    // ADD PRODUCT
    // ---------------------------------------------------------

    this.cartService.addToCart(
      currentProduct,
      this.quantity(),
      currentShopSlug
    );


    // ---------------------------------------------------------
    // MESSAGE
    // ---------------------------------------------------------

    this.cartMessage.set(
      `${this.quantity()} × ${currentProduct.name} added to cart`
    );


    setTimeout(() => {

      this.cartMessage.set('');

    }, 2500);

  }


  // =========================================================
  // DESTROY
  // =========================================================

  ngOnDestroy(): void {

    this.stopAutoSlider();

  }

}

