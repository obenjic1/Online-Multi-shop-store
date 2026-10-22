package com.bag_shop_api.bag_shop_api.Service;



import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



import lombok.RequiredArgsConstructor;

	

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bag_shop_api.bag_shop_api.DTO.RecentOrderSummary;
import com.bag_shop_api.bag_shop_api.DTO.ShopSalesSummary;
import com.bag_shop_api.bag_shop_api.DTO.SuperAdminDashboardResponse;
import com.bag_shop_api.bag_shop_api.Entity.Order;
import com.bag_shop_api.bag_shop_api.Enums.OrderStatus;
import com.bag_shop_api.bag_shop_api.Enums.Role;
import com.bag_shop_api.bag_shop_api.Repository.OrderRepository;
import com.bag_shop_api.bag_shop_api.Repository.ProductRepository;
import com.bag_shop_api.bag_shop_api.Repository.ShopRepository;
import com.bag_shop_api.bag_shop_api.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SuperAdminDashboardService {

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public SuperAdminDashboardResponse getDashboard() {

        SuperAdminDashboardResponse response =
                new SuperAdminDashboardResponse();

        // =====================================================
        // USERS
        // =====================================================

        response.setTotalAdmins(
                userRepository.countByRole(Role.ROLE_ADMIN));

        response.setActiveAdmins(
                userRepository.countByRoleAndEnabledTrue(
                        Role.ROLE_ADMIN));

        response.setInactiveAdmins(
                userRepository.countByRoleAndEnabledFalse(
                        Role.ROLE_ADMIN));

        response.setTotalCustomers(
                userRepository.countByRole(Role.ROLE_CUSTOMER));

        response.setActiveCustomers(
                userRepository.countByRoleAndEnabledTrue(
                        Role.ROLE_CUSTOMER));

        response.setInactiveCustomers(
                userRepository.countByRoleAndEnabledFalse(
                        Role.ROLE_CUSTOMER));

        // =====================================================
        // SHOPS
        // =====================================================

        response.setTotalShops(
                shopRepository.count());

        response.setActiveShops(
                shopRepository.countByActiveTrue());

        response.setInactiveShops(
                shopRepository.countByActiveFalse());

        // =====================================================
        // PRODUCTS
        // =====================================================

        response.setTotalProducts(
                productRepository.count());

        response.setActiveProducts(
                productRepository.countByActiveTrue());

        response.setInactiveProducts(
                productRepository.countByActiveFalse());

        response.setOutOfStockProducts(
                productRepository.countByStockQuantity(0));

        response.setLowStockProducts(
                productRepository
                        .countByStockQuantityGreaterThanAndStockQuantityLessThanEqual(
                                0,
                                5));

        // =====================================================
        // ORDERS
        // =====================================================

        response.setTotalOrders(
                orderRepository.count());

        response.setPendingOrders(
                orderRepository.countByStatus(
                        OrderStatus.PENDING));

        response.setConfirmedOrders(
                orderRepository.countByStatus(
                        OrderStatus.CONFIRMED));

        response.setProcessingOrders(
                orderRepository.countByStatus(
                        OrderStatus.PROCESSING));

        response.setShippedOrders(
                orderRepository.countByStatus(
                        OrderStatus.SHIPPED));

        response.setDeliveredOrders(
                orderRepository.countByStatus(
                        OrderStatus.DELIVERED));

        response.setCancelledOrders(
                orderRepository.countByStatus(
                        OrderStatus.CANCELLED));

        // =====================================================
        // DATE RANGES
        // =====================================================

        LocalDate today = LocalDate.now();

        LocalDateTime startOfToday =
                today.atStartOfDay();

        LocalDateTime startOfTomorrow =
                today.plusDays(1).atStartOfDay();

        LocalDateTime startOfMonth =
                today.withDayOfMonth(1).atStartOfDay();

        LocalDateTime startOfNextMonth =
                today.withDayOfMonth(1)
                        .plusMonths(1)
                        .atStartOfDay();

        // =====================================================
        // SALES
        // =====================================================

        BigDecimal totalSales =
                safeAmount(
                        orderRepository.sumTotalAmountByStatus(
                                OrderStatus.DELIVERED));

        response.setTotalSales(totalSales);

        BigDecimal todaySales =
                safeAmount(
                        orderRepository.sumTotalAmountByStatusBetween(
                                OrderStatus.DELIVERED,
                                startOfToday,
                                startOfTomorrow));

        response.setTodaySales(todaySales);

        BigDecimal monthlySales =
                safeAmount(
                        orderRepository.sumTotalAmountByStatusBetween(
                                OrderStatus.DELIVERED,
                                startOfMonth,
                                startOfNextMonth));

        response.setMonthlySales(monthlySales);

        /*
         * There is currently no payment entity/status in the system.
         *
         * Therefore we cannot yet calculate genuinely paid revenue.
         * For now this mirrors delivered sales.
         *
         * This should be changed when MTN Mobile Money/payment
         * processing is implemented.
         */
        response.setTotalPaidSales(totalSales);

        // =====================================================
        // ORDER VOLUME
        // =====================================================

        response.setTodayOrders(
                orderRepository
                        .countByCreatedAtGreaterThanEqualAndCreatedAtLessThan(
                                startOfToday,
                                startOfTomorrow));

        response.setMonthlyOrders(
                orderRepository
                        .countByCreatedAtGreaterThanEqualAndCreatedAtLessThan(
                                startOfMonth,
                                startOfNextMonth));

        // =====================================================
        // AVERAGE ORDER VALUE
        // =====================================================

        response.setAverageOrderValue(
                safeAmount(
                        orderRepository.averageTotalAmountByStatus(
                                OrderStatus.DELIVERED)));

        // =====================================================
        // TOP SHOPS
        // =====================================================

        response.setTopShops(
                buildTopShops());

        // =====================================================
        // RECENT ORDERS
        // =====================================================

        response.setRecentOrders(
                buildRecentOrders());

        return response;
    }

    // =========================================================
    // TOP SHOPS
    // =========================================================

    private List<ShopSalesSummary> buildTopShops() {

        List<Object[]> rows =
                orderRepository.findTopShopsBySales(
                        OrderStatus.DELIVERED);

        Map<Long, Long> productCounts =
                productRepository.countProductsByShop()
                        .stream()
                        .collect(Collectors.toMap(
                                row -> ((Number) row[0]).longValue(),
                                row -> ((Number) row[1]).longValue()
                        ));

        return rows.stream()
                .limit(5)
                .map(row -> {

                    Long shopId =
                            ((Number) row[0]).longValue();

                    String shopName =
                            (String) row[1];

                    String shopSlug =
                            (String) row[2];

                    String ownerUsername =
                            (String) row[3];

                    long totalOrders =
                            ((Number) row[4]).longValue();

                    BigDecimal totalSales =
                            toBigDecimal(row[5]);

                    BigDecimal averageOrderValue =
                            toBigDecimal(row[6]);

                    boolean active =
                            Boolean.TRUE.equals(row[7]);

                    long totalProducts =
                            productCounts.getOrDefault(
                                    shopId,
                                    0L);

                    return ShopSalesSummary.builder()
                            .shopId(shopId)
                            .shopName(shopName)
                            .shopSlug(shopSlug)
                            .ownerUsername(ownerUsername)
                            .totalOrders(totalOrders)
                            .totalProducts(totalProducts)
                            .totalSales(totalSales)
                            .averageOrderValue(averageOrderValue)
                            .active(active)
                            .build();
                })
                .toList();
    }

    // =========================================================
    // RECENT ORDERS
    // =========================================================

    private List<RecentOrderSummary> buildRecentOrders() {

        return orderRepository
                .findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapRecentOrder)
                .toList();
    }

    private RecentOrderSummary mapRecentOrder(Order order) {

        return RecentOrderSummary.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .shopName(order.getShop().getName())
                .customerName(order.getCustomerName())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .createdAt(order.getCreatedAt())
                .build();
    }

    // =========================================================
    // HELPERS
    // =========================================================

    private BigDecimal safeAmount(BigDecimal amount) {
        return amount != null
                ? amount
                : BigDecimal.ZERO;
    }

    private BigDecimal toBigDecimal(Object value) {

        if (value == null) {
            return BigDecimal.ZERO;
        }

        if (value instanceof BigDecimal) {
            return (BigDecimal) value;
        }

        if (value instanceof Number) {
            return BigDecimal.valueOf(
                    ((Number) value).doubleValue());
        }

        return BigDecimal.ZERO;
    }

   
}