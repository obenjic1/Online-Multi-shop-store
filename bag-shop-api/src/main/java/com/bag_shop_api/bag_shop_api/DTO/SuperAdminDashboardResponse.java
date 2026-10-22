package com.bag_shop_api.bag_shop_api.DTO;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class SuperAdminDashboardResponse {
	
    // =====================================================
    // USERS
    // =====================================================

    private long totalAdmins;
    private long activeAdmins;
    private long inactiveAdmins;

    private long totalCustomers;
    private long activeCustomers;
    private long inactiveCustomers;


    // =====================================================
    // SHOPS
    // =====================================================

    private long totalShops;
    private long activeShops;
    private long inactiveShops;


    // =====================================================
    // PRODUCTS
    // =====================================================

    private long totalProducts;
    private long activeProducts;
    private long inactiveProducts;
    private long outOfStockProducts;
    private long lowStockProducts;


    // =====================================================
    // ORDERS
    // =====================================================

    private long totalOrders;
    private long pendingOrders;
    private long confirmedOrders;
    private long processingOrders;
    private long shippedOrders;
    private long deliveredOrders;
    private long cancelledOrders;


    // =====================================================
    // SALES
    // =====================================================

    private BigDecimal totalSales;
    private BigDecimal totalPaidSales;

    private BigDecimal todaySales;
    private BigDecimal monthlySales;

    private long todayOrders;
    private long monthlyOrders;


    // =====================================================
    // AVERAGE ORDER VALUE
    // =====================================================

    private BigDecimal averageOrderValue;


    // =====================================================
    // SHOP PERFORMANCE
    // =====================================================

    private List<ShopSalesSummary> topShops;


    // =====================================================
    // RECENT ACTIVITY
    // =====================================================

    private List<RecentOrderSummary> recentOrders;

}
