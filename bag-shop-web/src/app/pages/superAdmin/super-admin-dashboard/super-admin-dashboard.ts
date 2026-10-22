import {
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RecentOrderSummary, ShopSalesSummary, SuperAdminDashboardResponse } from '../../../models/super-admin-dashboard.model';
import { SuperAdminDashboardService } from '../../../services/super-admin-dashboard-service';





@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './super-admin-dashboard.html',
  styleUrl: './super-admin-dashboard.css'
})
export class SuperAdminDashboard implements OnInit {

  private readonly dashboardService = inject(
    SuperAdminDashboardService
  );

  dashboard = signal<SuperAdminDashboardResponse | null>(null);
  loading = signal(true);
  error = signal(false);

  topShops = computed<ShopSalesSummary[]>(() =>
    this.dashboard()?.topShops ?? []
  );

  recentOrders = computed<RecentOrderSummary[]>(() =>
    this.dashboard()?.recentOrders ?? []
  );

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.error.set(false);

    this.dashboardService.getDashboard().subscribe({
      next: response => {
        this.dashboard.set(response);
        this.loading.set(false);
      },

      error: error => {
        console.error(
          'SUPER ADMIN DASHBOARD LOAD ERROR:',
          error
        );

        this.dashboard.set(null);
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  formatCurrency(value: number | null | undefined): string {
    return `${(value ?? 0).toLocaleString('en-US')} FCFA`;
  }

  formatDate(value: string | null | undefined): string {
    if (!value) {
      return '-';
    }

    return new Date(value).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'status-pending';

      case 'CONFIRMED':
        return 'status-confirmed';

      case 'PROCESSING':
        return 'status-processing';

      case 'SHIPPED':
        return 'status-shipped';

      case 'DELIVERED':
        return 'status-delivered';

      case 'CANCELLED':
        return 'status-cancelled';

      default:
        return 'status-default';
    }
  }

  getStatusLabel(status: string): string {
    if (!status) {
      return '-';
    }

    return status
      .toLowerCase()
      .replace('_', ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  getShopInitials(name: string | undefined): string {
    if (!name) {
      return 'S';
    }

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  }

  getOrderCustomerInitials(name: string | undefined): string {
    if (!name) {
      return 'C';
    }

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  }
}
