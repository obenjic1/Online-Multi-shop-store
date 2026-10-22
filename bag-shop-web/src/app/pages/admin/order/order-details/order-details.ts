import { Component, inject, signal } from '@angular/core';
import { OrderService } from '../../../../services/order-service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderResponse } from '../../../../models/order';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-order-details',
  styleUrl: './order-details.css',
  templateUrl: './order-details.html',
})
export class OrderDetails {


  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  order = signal<OrderResponse | null>(null);

  loading = signal(true);
  updatingStatus = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit(): void {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id) {
      this.errorMessage.set('Invalid order.');
      this.loading.set(false);
      return;
    }

    this.loadOrder(id);
  }

  loadOrder(id: number): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.orderService.getMyShopOrder(id).subscribe({
      next: response => {
        this.order.set(response);
        this.loading.set(false);
      },

      error: error => {
        console.error(
          'ADMIN ORDER DETAILS LOAD ERROR:',
          error
        );

        this.errorMessage.set(
          error?.error?.message ||
          'Unable to load this order.'
        );

        this.loading.set(false);
      }
    });
  }

  updateStatus(status: string): void {

    const currentOrder = this.order();

    if (!currentOrder || this.updatingStatus()) {
      return;
    }

    this.updatingStatus.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.orderService
      .updateOrderStatus(currentOrder.id, status)
      .subscribe({

        next: updatedOrder => {

          this.order.set(updatedOrder);

          this.successMessage.set(
            `Order status updated to ${this.formatStatus(status)}.`
          );

          this.updatingStatus.set(false);
        },

        error: error => {

          console.error(
            'ORDER STATUS UPDATE ERROR:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ||
            'Unable to update the order status.'
          );

          this.updatingStatus.set(false);
        }

      });
  }

  formatStatus(status: string): string {

    return status
      .toLowerCase()
      .replace('_', ' ')
      .replace(/\b\w/g, letter =>
        letter.toUpperCase()
      );
  }

  getNextStatus(): string | null {

    const status = this.order()?.status;

    switch (status) {

      case 'PENDING':
        return 'CONFIRMED';

      case 'CONFIRMED':
        return 'PROCESSING';

      case 'PROCESSING':
        return 'SHIPPED';

      case 'SHIPPED':
        return 'DELIVERED';

      default:
        return null;
    }
  }

  getNextStatusLabel(): string | null {

    const nextStatus = this.getNextStatus();

    return nextStatus
      ? this.formatStatus(nextStatus)
      : null;
  }

  canCancel(): boolean {

    const status = this.order()?.status;

    return (
      status !== undefined &&
      status !== 'CANCELLED' &&
      status !== 'DELIVERED'
    );
  }

  cancelOrder(): void {

    if (!this.canCancel()) {
      return;
    }

    this.updateStatus('CANCELLED');
  }

  goBack(): void {
    this.router.navigate(['/admin/orders']);
  }

}
