import { Routes } from '@angular/router';

export const routes: Routes = [

  // =========================================================
  // PUBLIC CUSTOMER - ALL PRODUCTS
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
  // CART
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
  // ADMIN - PRODUCTS
  // =========================================================

  {
    path: 'admin/products',

    loadComponent: () =>
      import('./pages/admin/products/admin-product-list/admin-product-list')
        .then(m => m.AdminProductList)
  },

  {
    path: 'admin/products/new',

    loadComponent: () =>
      import('./pages/admin/products/product-form/product-form')
        .then(m => m.ProductForm)
  },

  {
    path: 'admin/products/edit/:id',

    loadComponent: () =>
      import('./pages/admin/products/product-form/product-form')
        .then(m => m.ProductForm)
  },


  // =========================================================
  // DEFAULT
  // =========================================================

  {
    path: '',

    redirectTo: 'products',

    pathMatch: 'full'
  }

];
