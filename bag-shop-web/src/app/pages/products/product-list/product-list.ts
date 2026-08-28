import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../../services/services/product';
import { Product } from '../../../models/product.model';

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


  testProducts: Product[] = [
    {
      id: 101,
      name: 'Classic Leather Handbag',
      description: 'Elegant leather handbag for everyday use.',
      price: 45000,
      stockQuantity: 12,
      categoryName: 'Handbags',
      categoryId: 1,
      active: true,

      images: []
    },
    {
      id: 102,
      name: 'Premium Travel Backpack',
      description: 'Spacious backpack designed for travel.',
      price: 65000,
      stockQuantity: 8,
      categoryName: 'Backpacks',
      images: [],
      categoryId: 2,
      active: true
    },
    {
      id: 103,
      name: 'Mini Shoulder Bag',
      description: 'Compact and stylish shoulder bag.',
      price: 35000,
      stockQuantity: 15,
      categoryName: 'Shoulder Bags',
      categoryId: 1,
      active: true,
      images: []
    },
    {
      id: 104,
      name: 'Executive Laptop Backpack',
      description: 'Professional backpack with laptop compartment.',
      price: 75000,
      stockQuantity: 6,
      categoryName: 'Backpacks',
      categoryId: 1,
      active: true,
      images: []
    },
    {
      id: 105,
      name: 'Elegant Evening Clutch',
      description: 'Perfect clutch for evening occasions.',
      price: 30000,
      stockQuantity: 10,
      categoryName: 'Clutches',
      categoryId: 2,
      active: true,
      images: []
    },
    {
      id: 106,
      name: 'Classic Canvas Tote',
      description: 'Lightweight tote for everyday shopping.',
      price: 25000,
      stockQuantity: 20,
      categoryName: 'Tote Bags',
      categoryId: 1,
      active: true,
      images: []
    },
    {
      id: 107,
      name: 'Luxury Designer Handbag',
      description: 'Premium handbag with elegant finishing.',
      price: 95000,
      stockQuantity: 5,
      categoryName: 'Handbags',
      categoryId: 1,
      active: true,
      images: []
    },
    {
      id: 108,
      name: 'Weekend Travel Duffel',
      description: 'Large duffel bag for weekend trips.',
      price: 55000,
      stockQuantity: 9,
      categoryName: 'Travel Bags',
      categoryId: 1,
      active: true,
      images: []
    },
    {
      id: 109,
      name: 'Leather Crossbody Bag',
      description: 'Convenient crossbody bag for daily use.',
      price: 42000,
      stockQuantity: 11,
      categoryName: 'Shoulder Bags',
      categoryId: 1,
      active: true,
      images: []
    },
    {
      id: 110,
      name: 'Modern Office Tote',
      description: 'Stylish tote suitable for work and business.',
      price: 60000,
      stockQuantity: 7,
      categoryName: 'Tote Bags',
      categoryId: 1,
      active: true,
      images: []
    },
    {
      id: 111,
      name: 'Small Leather Clutch',
      description: 'Minimal leather clutch for special occasions.',
      price: 28000,
      stockQuantity: 14,
      categoryName: 'Clutches',
      images: [],
      categoryId: 2,
      active: true,
    },
    {
      id: 112,
      name: 'Adventure Backpack',
      description: 'Durable backpack for outdoor adventures.',
      price: 58000,
      stockQuantity: 13,
      categoryName: 'Backpacks',
      categoryId: 1,
      active: true,
      images: []
    },
    {
      id: 113,
      name: 'Luxury Shoulder Bag',
      description: 'Premium shoulder bag with modern styling.',
      price: 85000,
      stockQuantity: 4,
      categoryName: 'Shoulder Bags',
      categoryId: 1,
      active: true,
      images: []
    },
    {
      id: 114,
      name: 'Large Shopping Tote',
      description: 'Spacious reusable tote bag.',
      price: 22000,
      stockQuantity: 25,
      categoryName: 'Tote Bags',
      categoryId: 1,
      active: true,
      images: []
    },
    {
      id: 115,
      name: 'Business Laptop Bag',
      description: 'Professional bag designed for laptops and documents.',
      price: 70000,
      stockQuantity: 8,
      categoryName: 'Laptop Bags',
      categoryId: 1,
      active: true,
      images: []
    },
    {
      id: 116,
      name: 'Premium Leather Backpack',
      description: 'Luxury leather backpack for professionals.',
      price: 90000,
      stockQuantity: 3,
      categoryName: 'Backpacks',
      categoryId: 1,
      active: true,
      images: []
    },
    {
      id: 117,
      name: 'Classic Evening Clutch',
      description: 'Elegant clutch for parties and events.',
      price: 38000,
      stockQuantity: 9,
      categoryName: 'Clutches',
      categoryId: 2,
      active: true,
      images: []
    },
    {
      id: 118,
      name: 'Casual Crossbody Bag',
      description: 'Comfortable everyday crossbody bag.',
      price: 32000,
      stockQuantity: 18,
      categoryName: 'Shoulder Bags',
      categoryId: 1,
      active: true,
      images: []
    },
    {
      id: 119,
      name: 'Premium Office Backpack',
      description: 'Modern backpack for work and commuting.',
      price: 68000,
      stockQuantity: 6,
      categoryName: 'Backpacks',
      categoryId: 1,
      active: true,
      images: []
    },
    {
      id: 120,
      name: 'Luxury Travel Bag',
      description: 'Premium travel bag with spacious compartments.',
      price: 110000,
      stockQuantity: 3,
      categoryName: 'Travel Bags',
      categoryId: 1,
      active: true,
      images: []
    }
  ];

  private productService = inject(ProductService);

  // =========================================================
  // DATA
  // =========================================================

  products = signal<Product[]>([]);

  loading = signal(true);

  errorMessage = signal('');

  // =========================================================
  // FILTERS
  // =========================================================

  searchTerm = signal('');

  selectedCategory = signal('ALL');

  selectedStock = signal('ALL');

  sortBy = signal('DEFAULT');

  // =========================================================
  // PAGINATION
  // =========================================================

  currentPage = signal(1);

  pageSize = signal(8);

  // =========================================================
  // CATEGORIES
  // =========================================================

  ngOnInit(): void {

    this.products.set(this.testProducts);
    this.loadProducts();


    // this.buildCategories();

    //this.applyFilters();

  }





  categories = computed(() => {

    const names = this.products()
      .map(product => product.categoryName)
      .filter(
        (category): category is string =>
          !!category && category.trim().length > 0
      );

    return [...new Set(names)];

  });

  // =========================================================
  // FILTERED PRODUCTS
  // =========================================================

  filteredProducts = computed(() => {

    let result = [...this.products()];

    // -------------------------------------------------------
    // SEARCH
    // -------------------------------------------------------

    const search = this.searchTerm()
      .trim()
      .toLowerCase();

    if (search) {

      result = result.filter(product =>
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

    const category = this.selectedCategory();

    if (category !== 'ALL') {

      result = result.filter(
        product =>
          product.categoryName === category
      );

    }

    // -------------------------------------------------------
    // STOCK
    // -------------------------------------------------------

    const stock = this.selectedStock();

    if (stock === 'AVAILABLE') {

      result = result.filter(
        product =>
          product.stockQuantity > 0
      );

    }

    if (stock === 'OUT_OF_STOCK') {

      result = result.filter(
        product =>
          product.stockQuantity === 0
      );

    }

    // -------------------------------------------------------
    // SORT
    // -------------------------------------------------------

    switch (this.sortBy()) {

      case 'NAME_ASC':

        result.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        break;

      case 'NAME_DESC':

        result.sort((a, b) =>
          b.name.localeCompare(a.name)
        );

        break;

      case 'PRICE_LOW':

        result.sort(
          (a, b) =>
            Number(a.price) - Number(b.price)
        );

        break;

      case 'PRICE_HIGH':

        result.sort(
          (a, b) =>
            Number(b.price) - Number(a.price)
        );

        break;

      case 'STOCK':

        result.sort(
          (a, b) =>
            b.stockQuantity - a.stockQuantity
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

    const products = this.filteredProducts();

    const start =
      (this.currentPage() - 1) *
      this.pageSize();

    const end =
      start + this.pageSize();

    return products.slice(start, end);

  });

  pageNumbers = computed(() => {

    const total = this.totalPages();

    const current = this.currentPage();

    const pages: number[] = [];

    const maxVisiblePages = 5;

    let start = Math.max(
      1,
      current - 2
    );

    let end = Math.min(
      total,
      start + maxVisiblePages - 1
    );

    if (
      end - start + 1 <
      maxVisiblePages
    ) {

      start = Math.max(
        1,
        end - maxVisiblePages + 1
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

    if (this.totalItems() === 0) {
      return 0;
    }

    return (
      (this.currentPage() - 1) *
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
  // INIT
  // =========================================================



  // =========================================================
  // LOAD PRODUCTS
  // =========================================================

  loadProducts(): void {

    this.loading.set(true);

    this.errorMessage.set('');

    this.productService.findAll().subscribe({

      next: response => {


        /*
         * If your backend returns:
         *
         * Product[]
         *
         * this works directly.
         */

        this.products.set(response);

        this.currentPage.set(1);

        this.loading.set(false);

      },

      error: error => {

        console.error(
          'PRODUCT LOAD ERROR:',
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
  // SEARCH
  // =========================================================

  onSearch(event: Event): void {

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

  changeCategory(category: string): void {

    this.selectedCategory.set(
      category
    );

    this.currentPage.set(1);

  }

  // =========================================================
  // STOCK
  // =========================================================

  changeStock(stock: string): void {

    this.selectedStock.set(
      stock
    );

    this.currentPage.set(1);

  }

  // =========================================================
  // SORT
  // =========================================================

  changeSort(sort: string): void {

    this.sortBy.set(sort);

    this.currentPage.set(1);

  }

  // =========================================================
  // PAGE
  // =========================================================

  goToPage(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages()
    ) {

      return;

    }

    this.currentPage.set(page);

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

    this.selectedCategory.set('ALL');

    this.selectedStock.set('ALL');

    this.sortBy.set('DEFAULT');

    this.currentPage.set(1);

  }

  // =========================================================
  // CHECK FILTER STATE
  // =========================================================

  hasActiveFilters = computed(() => {

    return (
      this.searchTerm().trim() !== '' ||
      this.selectedCategory() !== 'ALL' ||
      this.selectedStock() !== 'ALL' ||
      this.sortBy() !== 'DEFAULT'
    );

  });



}
