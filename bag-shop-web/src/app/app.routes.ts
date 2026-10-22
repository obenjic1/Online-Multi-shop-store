import { Routes } from '@angular/router';
import { authGuardGuard } from './guards/auth-guard-guard';
import { SuperAdminLayout } from './pages/superAdmin/super-admin-layout/super-admin-layout';
import { ShopDetails } from './pages/superAdmin/shop-details/shop-details';
import { ShopEdit } from './pages/admin/shop/shop-edit/shop-edit';

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
    data: {
      roles: ['ROLE_ADMIN']
    },

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
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/admin/admin-category-list/admin-category-list')
            .then(m => m.AdminCategoryList)
      }, {
        path: 'orders',
        loadComponent: () =>
          import('./pages/admin/order/order-list/order-list')
            .then(m => m.OrderList)
      }, {
        path: 'orders/:id',
        loadComponent: () =>
          import('./pages/admin/order/order-details/order-details')
            .then(m => m.OrderDetails)
      }


    ]
  },
  {
    path: 'super-admin',

    component: SuperAdminLayout,

    canActivate: [authGuardGuard],

    data: {
      roles: ['ROLE_SUPER_ADMIN']
    },

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './pages/superAdmin/super-admin-dashboard/super-admin-dashboard'
          ).then(
            m => m.SuperAdminDashboard
          )
      },

      {
        path: 'administrators',
        loadComponent: () =>
          import(
            './pages/superAdmin/administrators/administrators'
          ).then(
            m => m.Administrators
          )
      },

      {
        path: 'shops',
        loadComponent: () =>
          import(
            './pages/superAdmin/super-admin-shops-component/super-admin-shops-component'
          ).then(
            m => m.SuperAdminShopsComponent
          )
      }, {
        path: 'shops/new',
        loadComponent: () =>
          import(
            './pages/superAdmin/add-shop/add-shop'
          ).then(
            m => m.AddShop
          )
      }, {
        path: 'shops/:id',
        component: ShopDetails
      }, {
        path: 'shops/:id/edit',
        component: ShopEdit
      }
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
