import { Component, computed, inject, signal } from '@angular/core';
import { OrderService } from '../../../../services/order-service';
import { OrderResponse } from '../../../../models/order';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-order-list',
  styleUrl: './order-list.css',
  templateUrl: './order-list.html',
})
export class OrderList {

  private orderService = inject(OrderService);

  orders = signal<OrderResponse[]>([]);

  loading = signal(true);
  errorMessage = signal('');

  searchTerm = signal('');
  selectedStatus = signal('ALL');
  selectedFulfillment = signal('ALL');

  currentPage = signal(1);
  pageSize = signal(8);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.orderService.getMyShopOrders().subscribe({
      next: response => {
        this.orders.set(response);
        this.currentPage.set(1);
        this.loading.set(false);
      },
      error: error => {
        console.error('ADMIN ORDER LOAD ERROR:', error);

        this.errorMessage.set(
          'Unable to load orders. Please try again.'
        );

        this.loading.set(false);
      }
    });
  }

  filteredOrders = computed(() => {
    let result = [...this.orders()];

    const search = this.searchTerm()
      .trim()
      .toLowerCase();

    if (search) {
      result = result.filter(order =>
        order.orderNumber?.toLowerCase().includes(search) ||
        order.customerName?.toLowerCase().includes(search) ||
        order.customerPhone?.toLowerCase().includes(search)
      );
    }

    const status = this.selectedStatus();

    if (status !== 'ALL') {
      result = result.filter(order =>
        order.status === status
      );
    }

    const fulfillment = this.selectedFulfillment();

    if (fulfillment !== 'ALL') {
      result = result.filter(order =>
        order.fulfillmentType === fulfillment
      );
    }

    result.sort((a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );

    return result;
  });

  totalOrders = computed(() =>
    this.orders().length
  );

  pendingOrders = computed(() =>
    this.orders().filter(
      order => order.status === 'PENDING'
    ).length
  );

  processingOrders = computed(() =>
    this.orders().filter(
      order =>
        order.status === 'CONFIRMED' ||
        order.status === 'PROCESSING'
    ).length
  );

  completedOrders = computed(() =>
    this.orders().filter(
      order => order.status === 'DELIVERED'
    ).length
  );

  totalPages = computed(() =>
    Math.ceil(
      this.filteredOrders().length /
      this.pageSize()
    )
  );

  paginatedOrders = computed(() => {
    const orders = this.filteredOrders();

    const start =
      (this.currentPage() - 1) *
      this.pageSize();

    const end =
      start + this.pageSize();

    return orders.slice(start, end);
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

  resultStart = computed(() => {

    if (this.filteredOrders().length === 0) {
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

      this.filteredOrders().length
    );
  });

  onSearch(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.searchTerm.set(input.value);

    this.currentPage.set(1);
  }

  changeStatus(value: string): void {

    this.selectedStatus.set(value);

    this.currentPage.set(1);
  }

  changeFulfillment(value: string): void {

    this.selectedFulfillment.set(value);

    this.currentPage.set(1);
  }

  clearFilters(): void {

    this.searchTerm.set('');

    this.selectedStatus.set('ALL');

    this.selectedFulfillment.set('ALL');

    this.currentPage.set(1);
  }

  hasActiveFilters = computed(() => {

    return (
      this.searchTerm().trim() !== '' ||
      this.selectedStatus() !== 'ALL' ||
      this.selectedFulfillment() !== 'ALL'
    );
  });

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

    if (this.currentPage() > 1) {
      this.goToPage(
        this.currentPage() - 1
      );
    }
  }

}
