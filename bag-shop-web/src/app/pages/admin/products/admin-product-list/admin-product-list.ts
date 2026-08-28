import { Component, computed, inject, signal } from '@angular/core';
import { ProductService } from '../../../../services/services/product';
import { CategoryService } from '../../../../services/category-service';
import { Category, Product } from '../../../../models/product.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  imports: [RouterLink, CommonModule],
  selector: 'app-admin-product-list',
  styleUrl: './admin-product-list.css',
  templateUrl: './admin-product-list.html',
})
export class AdminProductList {

  private productService = inject(ProductService);

  private categoryService = inject(CategoryService);


  // =========================================================
  // DATA
  // =========================================================

  products = signal<Product[]>([]);

  categories = signal<Category[]>([]);

  loading = signal(true);

  errorMessage = signal('');


  // =========================================================
  // FILTERS
  // =========================================================

  searchTerm = signal('');

  selectedCategory = signal('ALL');

  selectedStatus = signal('ALL');

  selectedStock = signal('ALL');


  // =========================================================
  // PAGINATION
  // =========================================================

  currentPage = signal(1);

  pageSize = signal(8);


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadProducts();

    this.loadCategories();

  }


  // =========================================================
  // LOAD PRODUCTS
  // =========================================================

  loadProducts(): void {

    this.loading.set(true);

    this.errorMessage.set('');

    this.productService.findAll().subscribe({

      next: response => {

        this.products.set(response);

        this.currentPage.set(1);

        this.loading.set(false);

      },

      error: error => {

        console.error(
          'ADMIN PRODUCT LOAD ERROR:',
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
  // LOAD CATEGORIES
  // =========================================================

  loadCategories(): void {

    this.categoryService.findAll().subscribe({

      next: response => {

        this.categories.set(response);

      },

      error: error => {

        console.error(
          'CATEGORY LOAD ERROR:',
          error
        );

      }

    });

  }


  // =========================================================
  // FILTERED PRODUCTS
  // =========================================================

  filteredProducts = computed(() => {

    let result = [...this.products()];


    // -------------------------------------------------------
    // SEARCH
    // -------------------------------------------------------

    const search =
      this.searchTerm()
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

    const category =
      this.selectedCategory();

    if (category !== 'ALL') {

      result = result.filter(product =>

        product.categoryId === Number(category)

      );

    }


    // -------------------------------------------------------
    // STATUS
    // -------------------------------------------------------

    const status =
      this.selectedStatus();

    if (status === 'ACTIVE') {

      result = result.filter(
        product => product.active
      );

    }

    if (status === 'INACTIVE') {

      result = result.filter(
        product => !product.active
      );

    }


    // -------------------------------------------------------
    // STOCK
    // -------------------------------------------------------

    const stock =
      this.selectedStock();

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

    result.sort((a, b) =>
      b.id - a.id
    );

    return result;

  });


  // =========================================================
  // STATISTICS
  // =========================================================

  totalItems = computed(() =>
    this.products().length
  );

  activeProducts = computed(() =>
    this.products()
      .filter(product => product.active)
      .length
  );

  inactiveProducts = computed(() =>
    this.products()
      .filter(product => !product.active)
      .length
  );

  outOfStockProducts = computed(() =>
    this.products()
      .filter(product =>
        product.stockQuantity === 0
      )
      .length
  );


  // =========================================================
  // PAGINATION
  // =========================================================

  totalPages = computed(() =>
    Math.ceil(
      this.filteredProducts().length /
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
      start + this.pageSize();

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
      Math.max(1, current - 2);

    let end =
      Math.min(
        total,
        start + maxVisiblePages - 1
      );

    if (
      end - start + 1 <
      maxVisiblePages
    ) {

      start =
        Math.max(
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


  resultStart = computed(() => {

    if (
      this.filteredProducts().length === 0
    ) {

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

      this.filteredProducts().length
    );

  });


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

  changeCategory(value: string): void {

    this.selectedCategory.set(value);

    this.currentPage.set(1);

  }


  // =========================================================
  // STATUS
  // =========================================================

  changeStatus(value: string): void {

    this.selectedStatus.set(value);

    this.currentPage.set(1);

  }


  // =========================================================
  // STOCK
  // =========================================================

  changeStock(value: string): void {

    this.selectedStock.set(value);

    this.currentPage.set(1);

  }


  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  clearFilters(): void {

    this.searchTerm.set('');

    this.selectedCategory.set('ALL');

    this.selectedStatus.set('ALL');

    this.selectedStock.set('ALL');

    this.currentPage.set(1);

  }


  // =========================================================
  // FILTER STATE
  // =========================================================

  hasActiveFilters = computed(() => {

    return (

      this.searchTerm().trim() !== ''

      ||

      this.selectedCategory() !== 'ALL'

      ||

      this.selectedStatus() !== 'ALL'

      ||

      this.selectedStock() !== 'ALL'

    );

  });


  // =========================================================
  // PAGINATION ACTIONS
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
  // DELETE
  // =========================================================

  deleteProduct(product: Product): void {

    // We'll add SweetAlert confirmation here
    // after the basic list is working.

    console.log(
      'Delete product:',
      product
    );

  }

}
