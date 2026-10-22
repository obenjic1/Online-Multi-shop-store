import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ShopService } from '../../../services/shop-service';
import { UserService } from '../../../services/user-service';
import { Shop } from '../../../models/shop-model';
import { User } from '../../../models/user';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-super-admin-shops',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, RouterLink
  ],
  templateUrl: './super-admin-shops-component.html',
  styleUrl: './super-admin-shops-component.css'
})
export class SuperAdminShopsComponent implements OnInit {


  private shopService = inject(ShopService);
  private userService = inject(UserService);

  // =========================================================
  // STATE
  // =========================================================

  shops = signal<Shop[]>([]);
  administrators = signal<User[]>([]);

  loading = signal(true);
  assigning = signal(false);

  searchTerm = signal('');
  statusFilter = signal<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  selectedShop = signal<Shop | null>(null);
  selectedAdminId = signal<number | null>(null);

  showAssignModal = signal(false);

  // =========================================================
  // COMPUTED
  // =========================================================

  filteredShops = computed(() => {

    const search = this.searchTerm()
      .trim()
      .toLowerCase();

    const status = this.statusFilter();

    return this.shops().filter(shop => {

      const matchesSearch =
        !search ||
        shop.name.toLowerCase().includes(search) ||
        shop.slug.toLowerCase().includes(search) ||
        shop.ownerUsername?.toLowerCase().includes(search);

      const matchesStatus =
        status === 'ALL' ||
        (status === 'ACTIVE' && shop.active) ||
        (status === 'INACTIVE' && !shop.active);

      return matchesSearch && matchesStatus;
    });
  });

  totalShops = computed(() =>
    this.shops().length
  );

  activeShops = computed(() =>
    this.shops().filter(shop => shop.active).length
  );

  inactiveShops = computed(() =>
    this.shops().filter(shop => !shop.active).length
  );

  assignedShops = computed(() =>
    this.shops().filter(shop => !!shop.ownerId).length
  );

  // Only actual administrators can own a shop
  availableAdministrators = computed(() =>
    this.administrators().filter(
      user => user.role === 'ROLE_ADMIN' && user.enabled
    )
  );

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {
    this.loadData();
  }

  // =========================================================
  // LOAD DATA
  // =========================================================

  loadData(): void {

    this.loading.set(true);

    this.shopService.getAllShops().subscribe({
      next: shops => {
        this.shops.set(shops);
        this.loading.set(false);
      },

      error: error => {

        console.error(
          'Failed to load shops:',
          error
        );

        this.loading.set(false);

        Swal.fire({
          icon: 'error',
          title: 'Unable to load shops',
          text: 'Something went wrong while loading the shops.'
        });
      }
    });

    this.userService.getUsers().subscribe({
      next: users => {
        this.administrators.set(users);
      },

      error: error => {

        console.error(
          'Failed to load administrators:',
          error
        );

        Swal.fire({
          icon: 'error',
          title: 'Unable to load administrators',
          text: 'Administrators could not be loaded.'
        });
      }
    });
  }

  // =========================================================
  // SEARCH / FILTER
  // =========================================================

  onSearch(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.searchTerm.set(input.value);
  }

  setStatusFilter(
    status: 'ALL' | 'ACTIVE' | 'INACTIVE'
  ): void {
    this.statusFilter.set(status);
  }

  clearFilters(): void {

    this.searchTerm.set('');
    this.statusFilter.set('ALL');
  }

  // =========================================================
  // ASSIGN ADMIN
  // =========================================================

  openAssignModal(shop: Shop): void {

    this.selectedShop.set(shop);

    this.selectedAdminId.set(
      shop.ownerId ?? null
    );

    this.showAssignModal.set(true);
  }

  closeAssignModal(): void {

    if (this.assigning()) {
      return;
    }

    this.showAssignModal.set(false);
    this.selectedShop.set(null);
    this.selectedAdminId.set(null);
  }

  onAdminChange(event: Event): void {

    const select =
      event.target as HTMLSelectElement;

    const adminId =
      Number(select.value);

    this.selectedAdminId.set(
      adminId || null
    );
  }

  assignAdmin(): void {

    const shop = this.selectedShop();
    const adminId = this.selectedAdminId();

    if (!shop) {
      return;
    }

    if (!adminId) {

      Swal.fire({
        icon: 'warning',
        title: 'Select an administrator',
        text: 'Please select an administrator for this shop.'
      });

      return;
    }

    const selectedAdmin =
      this.availableAdministrators()
        .find(admin => admin.id === adminId);

    if (!selectedAdmin) {

      Swal.fire({
        icon: 'error',
        title: 'Invalid administrator',
        text: 'The selected user cannot own a shop.'
      });

      return;
    }

    const isReassignment =
      !!shop.ownerId &&
      shop.ownerId !== adminId;

    Swal.fire({
      icon: 'question',
      title: isReassignment
        ? 'Reassign administrator?'
        : 'Assign administrator?',
      text: isReassignment
        ? `This will change the administrator of ${shop.name}.`
        : `${selectedAdmin.username} will become the administrator of ${shop.name}.`,
      showCancelButton: true,
      confirmButtonText: 'Yes, continue',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then(result => {

      if (!result.isConfirmed) {
        return;
      }

      this.performAssignment(
        shop.id,
        adminId
      );
    });
  }

  private performAssignment(
    shopId: number,
    adminId: number
  ): void {

    this.assigning.set(true);

    this.shopService
      .assignAdmin(shopId, adminId)
      .subscribe({

        next: updatedShop => {

          this.shops.update(shops =>
            shops.map(shop =>
              shop.id === updatedShop.id
                ? updatedShop
                : shop
            )
          );

          this.assigning.set(false);
          this.closeAssignModal();

          Swal.fire({
            icon: 'success',
            title: 'Administrator assigned',
            text: 'The shop administrator has been updated.',
            timer: 1800,
            showConfirmButton: false
          });
        },

        error: error => {

          console.error(
            'Failed to assign administrator:',
            error
          );

          this.assigning.set(false);

          Swal.fire({
            icon: 'error',
            title: 'Assignment failed',
            text:
              error?.error?.message ||
              'The administrator could not be assigned.'
          });
        }
      });
  }

  // =========================================================
  // HELPERS
  // =========================================================

  getLocation(shop: Shop): string {

    return [
      shop.city,
      shop.region
    ]
      .filter(Boolean)
      .join(', ');
  }
}
