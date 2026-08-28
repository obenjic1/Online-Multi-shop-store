import { Routes } from '@angular/router';


export const routes: Routes = [

  // =========================
  // CUSTOMER
  // =========================

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


  // =========================
  // ADMIN
  // =========================

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


  // =========================
  // DEFAULT
  // =========================

  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  }

];
