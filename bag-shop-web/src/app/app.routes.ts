import { Routes } from '@angular/router';
import { authGuardGuard } from './guards/auth-guard-guard';

export const routes: Routes = [

  // =========================================================
  // PUBLIC CUSTOMER
  // =========================================================

  {
    path: 'products',

    loadComponent: () =>
      import('./pages/products/product-list/product-list')
        .then(m => m.ProductList)
  },

  {
    path: 'products/:id',

    loadComponent: () =>
      import('./pages/products/product-details/product-details')
        .then(m => m.ProductDetails)
  },


  // =========================================================
  // PUBLIC CUSTOMER - SPECIFIC SHOP
  // =========================================================

  {
    path: 'shop/:slug',

    loadComponent: () =>
      import('./pages/products/product-list/product-list')
        .then(m => m.ProductList)
  },

  {
    path: 'shop/:slug/products/:id',

    loadComponent: () =>
      import('./pages/products/product-details/product-details')
        .then(m => m.ProductDetails)
  },


  // =========================================================
  // PUBLIC CUSTOMER - CART / CHECKOUT
  // =========================================================

  {
    path: 'cart',

    loadComponent: () =>
      import('./pages/cart/cart')
        .then(m => m.Cart)
  },

  {
    path: 'checkout',

    loadComponent: () =>
      import('./pages/checkout/checkout')
        .then(m => m.Checkout)
  },

  {
    path: 'order-confirmation',

    loadComponent: () =>
      import('./pages/order-confirmation/order-confirmation')
        .then(m => m.OrderConfirmation)
  },


  // =========================================================
  // AUTHENTICATION
  // =========================================================

  {
    path: 'login',

    loadComponent: () =>
      import('./pages/accounts/login/login')
        .then(m => m.Login)
  },


  // =========================================================
  // PROTECTED ADMIN ROUTES
  // =========================================================

  {
    path: 'admin',
    canActivate: [authGuardGuard],

    loadComponent: () =>
      import('./pages/admin/admin-layout/admin-layout')
        .then(m => m.AdminLayout),

    children: [

      {
        path: '',
        loadComponent: () =>
          import('./pages/admin/admin-dashboard/admin-dashboard')
            .then(m => m.AdminDashboard)
      },

      {
        path: 'shop',
        loadComponent: () =>
          import('./pages/admin/shop/shop-overview/shop-overview')
            .then(m => m.ShopOverview)
      },

      {
        path: 'shop/edit',
        loadComponent: () =>
          import('./pages/admin/shop/shop-edit/shop-edit')
            .then(m => m.ShopEdit)
      },

      {
        path: 'products',
        loadComponent: () =>
          import('./pages/admin/products/admin-product-list/admin-product-list')
            .then(m => m.AdminProductList)
      },

      {
        path: 'products/new',
        loadComponent: () =>
          import('./pages/admin/products/product-form/product-form')
            .then(m => m.ProductForm)
      },

      {
        path: 'products/edit/:id',
        loadComponent: () =>
          import('./pages/admin/products/product-form/product-form')
            .then(m => m.ProductForm)
      }

    ]
  },
  {
    path: 'super-admin',
    canActivateChild: [authGuardGuard],
    data: {
      roles: ['ROLE_SUPER_ADMIN']
    },
    children: [
      // super admin pages will go here
    ]
  },
  // =========================================================
  // DEFAULT
  // =========================================================

  {
    path: '',

    redirectTo: 'products',

    pathMatch: 'full'
  },


  // =========================================================
  // FALLBACK
  // =========================================================

  {
    path: '**',

    redirectTo: 'products'
  }

];
