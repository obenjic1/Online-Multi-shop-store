import {
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { ProductService } from '../../../services/services/product';
import { CartService } from '../../../services/cart';

import {
  Product,
  ProductImage
} from '../../../models/product.model';


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

  private route = inject(ActivatedRoute);

  private productService = inject(ProductService);

  private cartService = inject(CartService);


  // =========================================================
  // PRODUCT
  // =========================================================

  product = signal<Product | null>(null);


  // =========================================================
  // IMAGES
  // =========================================================

  images = signal<ProductImage[]>([]);

  selectedImage = signal<ProductImage | null>(null);

  currentImageIndex = signal(0);


  // =========================================================
  // UI STATE
  // =========================================================

  quantity = signal(1);

  cartMessage = signal('');

  loading = signal(true);


  // =========================================================
  // AUTO SLIDER
  // =========================================================

  private sliderInterval: ReturnType<typeof setInterval> | null = null;

  private readonly sliderDelay = 4500;


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id) {
      this.loading.set(false);
      return;
    }

    this.loadProduct(id);

    this.loadImages(id);
  }


  // =========================================================
  // LOAD PRODUCT
  // =========================================================

  private loadProduct(id: number): void {

    this.productService.findById(id).subscribe({

      next: product => {

        this.product.set(product);

        this.loading.set(false);
      },

      error: error => {

        console.error(
          'ERROR LOADING PRODUCT:',
          error
        );

        this.loading.set(false);
      }

    });

  }


  // =========================================================
  // LOAD IMAGES
  // =========================================================

  private loadImages(id: number): void {

    this.productService.findImages(id).subscribe({

      next: images => {

        this.images.set(images);

        if (images.length > 0) {

          const primaryIndex = images.findIndex(
            image => image.primaryImage
          );

          const startIndex =
            primaryIndex >= 0
              ? primaryIndex
              : 0;

          this.currentImageIndex.set(
            startIndex
          );

          this.selectedImage.set(
            images[startIndex]
          );

          this.startAutoSlider();
        }

      },

      error: error => {

        console.error(
          'ERROR LOADING PRODUCT IMAGES:',
          error
        );

      }

    });

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

    const productImages = this.images();

    if (productImages.length <= 1) {
      return;
    }

    const nextIndex =
      (this.currentImageIndex() + 1)
      % productImages.length;

    this.currentImageIndex.set(nextIndex);

    this.selectedImage.set(
      productImages[nextIndex]
    );

  }


  // =========================================================
  // PREVIOUS IMAGE
  // =========================================================

  previousImage(): void {

    const productImages = this.images();

    if (productImages.length <= 1) {
      return;
    }

    const previousIndex =
      (this.currentImageIndex() - 1 + productImages.length)
      % productImages.length;

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

    this.sliderInterval = setInterval(() => {

      this.nextImage();

    }, this.sliderDelay);

  }


  private restartAutoSlider(): void {

    this.startAutoSlider();

  }


  private stopAutoSlider(): void {

    if (this.sliderInterval) {

      clearInterval(this.sliderInterval);

      this.sliderInterval = null;

    }

  }


  // =========================================================
  // QUANTITY
  // =========================================================

  increaseQuantity(): void {

    const currentProduct = this.product();

    if (!currentProduct) {
      return;
    }

    if (
      this.quantity()
      < currentProduct.stockQuantity
    ) {

      this.quantity.update(
        value => value + 1
      );

    }

  }


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

    const currentProduct = this.product();

    if (!currentProduct) {
      return;
    }

    this.cartService.addToCart(
      currentProduct,
      this.quantity()
    );

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
