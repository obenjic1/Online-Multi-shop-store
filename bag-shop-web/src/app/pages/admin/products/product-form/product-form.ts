
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ProductService } from '../../../../services/services/product';
import { CategoryService } from '../../../../services/category-service';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  Category,
  Product,
  ProductImage
} from '../../../../models/product.model';

import { CommonModule } from '@angular/common';
import { SweetAlertService } from '../../../../services/sweet-alert-service';



@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  selector: 'app-product-form',

  styleUrl: './product-form.css',

  templateUrl: './product-form.html',
})
export class ProductForm {

  // =========================================================
  // SERVICES
  // =========================================================

  private fb = inject(FormBuilder);

  private productService =
    inject(ProductService);

  private categoryService =
    inject(CategoryService);

  private sweetAlert = inject(SweetAlertService);

  private route =
    inject(ActivatedRoute);

  private router =
    inject(Router);


  // =========================================================
  // STATE
  // =========================================================

  loading = signal(false);

  saving = signal(false);

  loadingCategories = signal(false);

  errorMessage = signal('');

  successMessage = signal('');


  // =========================================================
  // MODE
  // =========================================================

  isEditMode = signal(false);

  productId = signal<number | null>(null);


  // =========================================================
  // DATA
  // =========================================================

  categories = signal<Category[]>([]);

  product = signal<Product | null>(null);
  // =========================================================
  // CATEGORY MODAL STATE
  // =========================================================

  showCategoryForm = signal(false);

  creatingCategory = signal(false);

  categoryError = signal('');

  categorySuccess = signal('');


  categoryForm = this.fb.group({

    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]
    ]

  });




  // =========================================================
  // IMAGE STATE
  // =========================================================

  /**
   * Images that already exist in the database.
   */
  existingImages = signal<ProductImage[]>([]);


  /**
   * New files selected from the user's computer.
   */
  selectedFiles = signal<File[]>([]);


  /**
   * Preview URLs for newly selected files.
   */
  imagePreviews = signal<string[]>([]);


  imagesToDelete = signal<number[]>([]);


  // =========================================================
  // FORM
  // =========================================================

  productForm = this.fb.group({

    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(150)
      ]
    ],

    description: [
      '',
      [
        Validators.maxLength(1000)
      ]
    ],

    price: [
      0,
      [
        Validators.required,
        Validators.min(0)
      ]
    ],

    stockQuantity: [
      0,
      [
        Validators.required,
        Validators.min(0)
      ]
    ],

    categoryId: [
      null as number | null,
      [
        Validators.required
      ]
    ],

    active: [
      true
    ]

  });


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadCategories();

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {

      const numericId = Number(id);

      if (Number.isNaN(numericId)) {

        this.errorMessage.set(
          'Invalid product ID.'
        );

        return;

      }

      this.isEditMode.set(true);

      this.productId.set(
        numericId
      );

      this.loadProduct(
        numericId
      );

    }

  }


  // =========================================================
  // LOAD CATEGORIES
  // =========================================================

  loadCategories(): void {

    this.loadingCategories.set(true);

    this.categoryService.findAll().subscribe({

      next: response => {

        this.categories.set(response);

        this.loadingCategories.set(false);

      },

      error: error => {

        console.error(
          'CATEGORY LOAD ERROR:',
          error
        );

        this.loadingCategories.set(false);

        this.errorMessage.set(
          'Unable to load categories.'
        );

      }

    });

  }

  // =========================================================
  // CATEGORY FORM
  // =========================================================

  openCategoryForm(): void {

    this.categoryError.set('');

    this.categorySuccess.set('');

    this.categoryForm.reset();

    this.showCategoryForm.set(true);

  }


  closeCategoryForm(): void {

    if (this.creatingCategory()) {
      return;
    }

    this.showCategoryForm.set(false);

    this.categoryError.set('');

    this.categorySuccess.set('');

  }


  // =========================================================
  // CREATE CATEGORY
  // =========================================================

  createCategory(): void {

    this.categoryError.set('');

    this.categorySuccess.set('');

    if (this.categoryForm.invalid) {

      this.categoryForm.markAllAsTouched();

      return;

    }

    const name =
      this.categoryForm
        .get('name')
        ?.value
        ?.trim();

    if (!name) {

      this.categoryForm
        .get('name')
        ?.setErrors({
          required: true
        });

      return;

    }

    this.creatingCategory.set(true);

    this.categoryService
      .create({
        name
      })
      .subscribe({

        next: category => {

          // Add the newly created category
          // immediately to the existing list.

          this.categories.update(
            categories => [
              ...categories,
              category
            ]
          );


          // Automatically select the
          // newly created category.

          this.productForm.patchValue({

            categoryId: category.id

          });


          this.creatingCategory.set(false);

          this.sweetAlert.toast('success', "Category added Successfully",)


          // Clear the category form.

          this.categoryForm.reset();


          // Close the category form
          // after a short delay.

          setTimeout(() => {

            this.showCategoryForm.set(false);

            this.categorySuccess.set('');

          }, 800);

        },

        error: error => {

          console.error(
            'CREATE CATEGORY ERROR:',
            error
          );

          this.creatingCategory.set(false);

          this.categoryError.set(
            error?.error?.message ||
            'Unable to create category. Please try again.'
          );

        }

      });

  }


  // =========================================================
  // LOAD PRODUCT
  // =========================================================

  loadProduct(id: number): void {

    this.loading.set(true);

    this.errorMessage.set('');

    this.productService.findById(id).subscribe({

      next: response => {

        this.product.set(response);

        this.patchProduct(response);

        /*
         * Load the actual image records separately.
         */
        this.loadExistingImages(id);

        this.loading.set(false);

      },

      error: error => {

        console.error(
          'PRODUCT LOAD ERROR:',
          error
        );

        this.errorMessage.set(
          'Unable to load product.'
        );

        this.loading.set(false);

      }

    });

  }


  // =========================================================
  // LOAD EXISTING IMAGES
  // =========================================================

  loadExistingImages(productId: number): void {

    this.productService
      .findImages(productId)
      .subscribe({

        next: images => {

          this.existingImages.set(
            images ?? []
          );

          /*
           * Reset deletion list when product
           * is initially loaded.
           */
          this.imagesToDelete.set([]);

        },

        error: error => {

          console.error(
            'PRODUCT IMAGES LOAD ERROR:',
            error
          );

          /*
           * Do not prevent the product form
           * from loading just because images
           * failed to load.
           */
          this.existingImages.set([]);

        }

      });

  }


  // =========================================================
  // PATCH PRODUCT
  // =========================================================

  patchProduct(product: Product): void {

    this.productForm.patchValue({

      name:
        product.name,

      description:
        product.description || '',

      price:
        Number(product.price),

      stockQuantity:
        Number(product.stockQuantity),

      categoryId:
        product.categoryId,

      active:
        product.active

    });

  }


  // =========================================================
  // FILE SELECTION
  // =========================================================

  onFilesSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (!input.files) {

      return;

    }

    const files =
      Array.from(input.files);

    /*
     * Add the newly selected files to
     * the existing selection instead of
     * replacing them.
     */
    this.selectedFiles.update(
      currentFiles => [
        ...currentFiles,
        ...files
      ]
    );


    /*
     * Generate previews for the new files.
     */
    files.forEach(file => {

      const reader =
        new FileReader();

      reader.onload = () => {

        this.imagePreviews.update(
          previews => [
            ...previews,
            reader.result as string
          ]
        );

      };

      reader.readAsDataURL(file);

    });


    /*
     * Reset the input so selecting the
     * same file again is possible.
     */
    input.value = '';

  }


  // =========================================================
  // REMOVE SELECTED IMAGE
  // =========================================================

  removeSelectedImage(index: number): void {

    const files =
      [...this.selectedFiles()];

    const previews =
      [...this.imagePreviews()];

    if (
      index < 0 ||
      index >= files.length
    ) {

      return;

    }

    files.splice(index, 1);

    previews.splice(index, 1);

    this.selectedFiles.set(
      files
    );

    this.imagePreviews.set(
      previews
    );

  }


  // =========================================================
  // REMOVE EXISTING IMAGE
  // =========================================================

  removeExistingImage(image: ProductImage): void {

    const productId = this.productId();

    if (!productId) {

      return;

    }

    this.sweetAlert.confirm(
      'Delete Product?',
      `Are you sure you want to delete  this Image ?`,
      'Yes, Delete'
    ).then(result => {

      if (result.isConfirmed) {

        this.productService
          .deleteImage(productId, image.id)
          .subscribe({

            next: () => {

              this.existingImages.update(images =>
                images.filter(item =>
                  item.id !== image.id
                )
              );

              this.sweetAlert.toast("success", "Picture Deleted Successfully")

            },

            error: error => {

              console.error(
                'DELETE IMAGE ERROR:',
                error
              );

              this.errorMessage.set(
                'Unable to delete image.'
              );

            }

          });

      }

    });



  }


  // =========================================================
  // RESTORE EXISTING IMAGE
  // =========================================================

  restoreExistingImage(
    image: ProductImage
  ): void {

    /*
     * Remove it from the deletion queue.
     */
    this.imagesToDelete.update(
      ids =>
        ids.filter(
          id => id !== image.id
        )
    );


    /*
     * Add it back to the displayed images.
     */
    this.existingImages.update(
      images => {

        if (
          images.some(
            existing =>
              existing.id === image.id
          )
        ) {

          return images;

        }

        return [
          ...images,
          image
        ].sort(
          (a, b) =>
            a.displayOrder -
            b.displayOrder
        );

      }
    );

  }


  // =========================================================
  // SAVE
  // =========================================================

  save(): void {

    this.errorMessage.set('');

    this.successMessage.set('');



    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (this.productForm.invalid) {

      this.productForm.markAllAsTouched();

      return;

    }


    this.saving.set(true);


    const formValue =
      this.productForm.getRawValue();


    const data = {

      name:
        formValue.name?.trim(),

      description:
        formValue.description?.trim(),

      price:
        Number(formValue.price),

      stockQuantity:
        Number(formValue.stockQuantity),

      categoryId:
        Number(formValue.categoryId),

      active:
        formValue.active

    };


    // =======================================================
    // CREATE
    // =======================================================

    if (!this.isEditMode()) {

      this.productService
        .create(data)
        .subscribe({

          next: product => {

            this.product.set(product);


            this.uploadImagesAndFinish(
              product.id
            );
            this.sweetAlert.success(
              'Product Created',
              'The product was successfully created.'
            );



          },

          error: error => {

            console.error(
              'CREATE PRODUCT ERROR:',
              error
            );
            this.sweetAlert.close();

            this.saving.set(false);

            this.sweetAlert.error(
              'Creation Failed',
              'Unable to create the product.'
            );

          }

        });

      return;

    }


    // =======================================================
    // UPDATE
    // =======================================================

    const id =
      this.productId();

    if (!id) {

      this.saving.set(false);

      this.errorMessage.set(
        'Invalid product ID.'
      );

      return;

    }


    this.productService
      .update(
        id,
        data
      )
      .subscribe({

        next: product => {

          this.product.set(product);

          /*
           * Continue with image processing.
           */
          this.uploadImagesAndFinish(
            product.id
          );

        },

        error: error => {

          console.error(
            'UPDATE PRODUCT ERROR:',
            error
          );

          this.saving.set(false);

          this.errorMessage.set(
            'Unable to update product.'
          );

        }

      });

  }


  // =========================================================
  // UPLOAD IMAGES AND FINISH
  // =========================================================

  uploadImagesAndFinish(
    productId: number
  ): void {

    const files =
      this.selectedFiles();


    /*
     * If there are no new images,
     * simply finish the operation.
     *
     * Existing image deletion will be
     * connected once the backend delete
     * endpoint is available.
     */
    if (files.length === 0) {

      this.finishSave();

      return;

    }


    this.productService
      .uploadImages(
        productId,
        files
      )
      .subscribe({

        next: () => {

          this.finishSave();

        },

        error: error => {

          console.error(
            'IMAGE UPLOAD ERROR:',
            error
          );

          /*
           * The product itself was already
           * created/updated successfully.
           */
          this.saving.set(false);

          this.errorMessage.set(
            'Product was saved, but the images could not be uploaded.'
          );

        }

      });

  }


  // =========================================================
  // FINISH SAVE
  // =========================================================

  finishSave(): void {

    this.saving.set(false);

    this.router.navigate([
      '/admin/products'
    ]);

  }


  // =========================================================
  // CANCEL
  // =========================================================

  cancel(): void {

    if (this.saving()) {

      return;

    }

    this.router.navigate([
      '/admin/products'
    ]);

  }


  // =========================================================
  // FORM HELPERS
  // =========================================================

  isInvalid(
    controlName: string
  ): boolean {

    const control =
      this.productForm.get(
        controlName
      );

    return !!(
      control &&
      control.invalid &&
      control.touched
    );

  }
  // =========================================================
  // CATEGORY FORM HELPERS
  // =========================================================

  isCategoryInvalid(): boolean {

    const control =
      this.categoryForm.get('name');

    return !!(
      control &&
      control.invalid &&
      control.touched
    );

  }




}

