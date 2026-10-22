export interface SuperAdminDashboardResponse {

  // USERS
  totalAdmins: number;
  activeAdmins: number;
  inactiveAdmins: number;

  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;

  // SHOPS
  totalShops: number;
  activeShops: number;
  inactiveShops: number;

  // PRODUCTS
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;

  // ORDERS
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;

  // SALES
  totalSales: number;
  totalPaidSales: number;
  todaySales: number;
  monthlySales: number;

  todayOrders: number;
  monthlyOrders: number;

  // AVERAGE ORDER VALUE
  averageOrderValue: number;

  // SHOP PERFORMANCE
  topShops: ShopSalesSummary[];

  // RECENT ORDERS
  recentOrders: RecentOrderSummary[];
}


export interface ShopSalesSummary {

  shopId: number;
  shopName: string;
  shopSlug: string;
  ownerUsername: string;

  totalOrders: number;
  totalProducts: number;

  totalSales: number;
  averageOrderValue: number;

  active: boolean;
}


export interface RecentOrderSummary {

  orderId: number;
  orderNumber: string;

  shopName: string;
  customerName: string;

  totalAmount: number;
  status: string;

  createdAt: string;
}
