
import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { Product } from '../../../models/product.model';
import { PublicProductService } from '../../../services/public/public-product-service';

@Component({
  selector: 'app-product-list',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './product-list.html',

  styleUrl: './product-list.css'
})
export class ProductList {

  // =========================================================
  // SERVICES
  // =========================================================

  private publicProductService =
    inject(PublicProductService);

  private route =
    inject(ActivatedRoute);


  // =========================================================
  // DATA
  // =========================================================

  products =
    signal<Product[]>([]);

  loading =
    signal(true);

  errorMessage =
    signal('');

  /**
   * null  = global storefront
   * value = specific shop storefront
   *
   * Examples:
   *
   * /products
   * /shop/kellyshop
   */
  shopSlug =
    signal<string | null>(null);


  // =========================================================
  // FILTERS
  // =========================================================

  searchTerm =
    signal('');

  selectedCategory =
    signal('ALL');

  selectedStock =
    signal('ALL');

  sortBy =
    signal('DEFAULT');


  // =========================================================
  // PAGINATION
  // =========================================================

  currentPage =
    signal(1);

  pageSize =
    signal(8);


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    /**
     * The same component is used by:
     *
     * /products
     *
     * and
     *
     * /shop/:slug
     *
     * Therefore we read the optional slug from
     * the current route.
     */

    const slug =
      this.route.snapshot.paramMap.get('slug');

    this.shopSlug.set(slug);

    this.loadProducts();

  }


  // =========================================================
  // CATEGORIES
  // =========================================================

  categories = computed(() => {

    const names =
      this.products()
        .map(product => product.categoryName)
        .filter(
          (category): category is string =>
            !!category &&
            category.trim().length > 0
        );

    return [
      ...new Set(names)
    ];

  });


  // =========================================================
  // FILTERED PRODUCTS
  // =========================================================

  filteredProducts = computed(() => {

    let result =
      [...this.products()];


    // -------------------------------------------------------
    // SEARCH
    // -------------------------------------------------------

    const search =
      this.searchTerm()
        .trim()
        .toLowerCase();

    if (search) {

      result =
        result.filter(product =>

          product.name
            ?.toLowerCase()
            .includes(search)

          ||

          product.description
            ?.toLowerCase()
            .includes(search)

          ||

          product.categoryName
            ?.toLowerCase()
            .includes(search)

        );

    }


    // -------------------------------------------------------
    // CATEGORY
    // -------------------------------------------------------

    const category =
      this.selectedCategory();

    if (category !== 'ALL') {

      result =
        result.filter(
          product =>
            product.categoryName === category
        );

    }


    // -------------------------------------------------------
    // STOCK
    // -------------------------------------------------------

    const stock =
      this.selectedStock();

    if (stock === 'AVAILABLE') {

      result =
        result.filter(
          product =>
            product.stockQuantity > 0
        );

    }

    if (stock === 'OUT_OF_STOCK') {

      result =
        result.filter(
          product =>
            product.stockQuantity === 0
        );

    }


    // -------------------------------------------------------
    // SORT
    // -------------------------------------------------------

    switch (this.sortBy()) {

      case 'NAME_ASC':

        result.sort(
          (a, b) =>
            a.name.localeCompare(b.name)
        );

        break;


      case 'NAME_DESC':

        result.sort(
          (a, b) =>
            b.name.localeCompare(a.name)
        );

        break;


      case 'PRICE_LOW':

        result.sort(
          (a, b) =>
            Number(a.price) -
            Number(b.price)
        );

        break;


      case 'PRICE_HIGH':

        result.sort(
          (a, b) =>
            Number(b.price) -
            Number(a.price)
        );

        break;


      case 'STOCK':

        result.sort(
          (a, b) =>
            b.stockQuantity -
            a.stockQuantity
        );

        break;

    }

    return result;

  });


  // =========================================================
  // PAGINATION CALCULATIONS
  // =========================================================

  totalItems = computed(() =>
    this.filteredProducts().length
  );


  totalPages = computed(() =>
    Math.ceil(
      this.totalItems() /
      this.pageSize()
    )
  );


  paginatedProducts = computed(() => {

    const products =
      this.filteredProducts();

    const start =
      (this.currentPage() - 1) *
      this.pageSize();

    const end =
      start +
      this.pageSize();

    return products.slice(
      start,
      end
    );

  });


  pageNumbers = computed(() => {

    const total =
      this.totalPages();

    const current =
      this.currentPage();

    const pages: number[] = [];

    const maxVisiblePages = 5;

    let start =
      Math.max(
        1,
        current - 2
      );

    let end =
      Math.min(
        total,
        start +
        maxVisiblePages -
        1
      );


    if (
      end -
      start +
      1 <
      maxVisiblePages
    ) {

      start =
        Math.max(
          1,
          end -
          maxVisiblePages +
          1
        );

    }


    for (
      let page = start;
      page <= end;
      page++
    ) {

      pages.push(page);

    }

    return pages;

  });


  // =========================================================
  // RESULT RANGE
  // =========================================================

  resultStart = computed(() => {

    if (
      this.totalItems() === 0
    ) {

      return 0;

    }

    return (
      (
        this.currentPage() -
        1
      ) *
      this.pageSize()
    ) + 1;

  });


  resultEnd = computed(() => {

    return Math.min(
      this.currentPage() *
      this.pageSize(),
      this.totalItems()
    );

  });


  // =========================================================
  // LOAD PRODUCTS
  // =========================================================

  loadProducts(): void {

    this.loading.set(true);

    this.errorMessage.set('');


    const slug =
      this.shopSlug();


    // =======================================================
    // SHOP STOREFRONT
    // =======================================================

    if (slug) {

      this.publicProductService
        .findByShop(slug)
        .subscribe({

          next: response => {

            this.products.set(
              response
            );

            this.currentPage.set(1);

            this.loading.set(false);

          },


          error: error => {

            console.error(
              'SHOP PRODUCT LOAD ERROR:',
              error
            );

            this.errorMessage.set(
              'Unable to load this shop. Please try again.'
            );

            this.loading.set(false);

          }

        });

      return;

    }


    // =======================================================
    // GLOBAL STOREFRONT
    // =======================================================

    this.publicProductService
      .findAll()
      .subscribe({

        next: response => {

          this.products.set(
            response
          );

          this.currentPage.set(1);

          this.loading.set(false);

        },


        error: error => {

          console.error(
            'PUBLIC PRODUCT LOAD ERROR:',
            error
          );

          this.errorMessage.set(
            'Unable to load products. Please try again.'
          );

          this.loading.set(false);

        }

      });

  }


  // =========================================================
  // PRODUCT LINK
  // =========================================================

  /**
   * IMPORTANT:
   *
   * This method controls ALL product-detail navigation.
   *
   * Global:
   *
   * /products/1
   *
   * Shop:
   *
   * /shop/kellyshop/products/1
   */

  getProductLink(
    productId: number
  ): string[] {

    const slug =
      this.shopSlug();


    // -------------------------------------------------------
    // SHOP PRODUCT
    // -------------------------------------------------------

    if (slug) {

      return [
        '/shop',
        slug,
        'products',
        productId.toString()
      ];

    }


    // -------------------------------------------------------
    // GLOBAL PRODUCT
    // -------------------------------------------------------

    return [
      '/products',
      productId.toString()
    ];

  }


  // =========================================================
  // SEARCH
  // =========================================================

  onSearch(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    this.searchTerm.set(
      input.value
    );

    this.currentPage.set(1);

  }


  // =========================================================
  // CATEGORY
  // =========================================================

  changeCategory(
    category: string
  ): void {

    this.selectedCategory.set(
      category
    );

    this.currentPage.set(1);

  }


  // =========================================================
  // STOCK
  // =========================================================

  changeStock(
    stock: string
  ): void {

    this.selectedStock.set(
      stock
    );

    this.currentPage.set(1);

  }


  // =========================================================
  // SORT
  // =========================================================

  changeSort(
    sort: string
  ): void {

    this.sortBy.set(
      sort
    );

    this.currentPage.set(1);

  }


  // =========================================================
  // PAGE
  // =========================================================

  goToPage(
    page: number
  ): void {

    if (
      page < 1 ||
      page > this.totalPages()
    ) {

      return;

    }

    this.currentPage.set(
      page
    );

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }


  nextPage(): void {

    if (
      this.currentPage() <
      this.totalPages()
    ) {

      this.goToPage(
        this.currentPage() + 1
      );

    }

  }


  previousPage(): void {

    if (
      this.currentPage() > 1
    ) {

      this.goToPage(
        this.currentPage() - 1
      );

    }

  }


  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  clearFilters(): void {

    this.searchTerm.set('');

    this.selectedCategory.set(
      'ALL'
    );

    this.selectedStock.set(
      'ALL'
    );

    this.sortBy.set(
      'DEFAULT'
    );

    this.currentPage.set(1);

  }


  // =========================================================
  // CHECK FILTER STATE
  // =========================================================

  hasActiveFilters = computed(() => {

    return (

      this.searchTerm()
        .trim() !== ''

      ||

      this.selectedCategory() !==
      'ALL'

      ||

      this.selectedStock() !==
      'ALL'

      ||

      this.sortBy() !==
      'DEFAULT'

    );

  });

}

