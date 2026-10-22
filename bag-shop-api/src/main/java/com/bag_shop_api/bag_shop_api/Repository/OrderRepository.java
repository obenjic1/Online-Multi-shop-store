package com.bag_shop_api.bag_shop_api.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bag_shop_api.bag_shop_api.Entity.Order;
import com.bag_shop_api.bag_shop_api.Enums.OrderStatus;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    // =========================================================
    // ADMIN / SHOP ORDERS
    // =========================================================

    @EntityGraph(attributePaths = {
            "shop",
            "items",
            "items.product"
    })
    List<Order> findByShopIdOrderByCreatedAtDesc(Long shopId);

    @EntityGraph(attributePaths = {
            "shop",
            "items",
            "items.product"
    })
    Optional<Order> findByIdAndShopId(
            Long orderId,
            Long shopId
    );

    // =========================================================
    // ORDER STATUS
    // =========================================================

    long countByStatus(OrderStatus status);

    // =========================================================
    // SALES
    // =========================================================

    @Query("""
        SELECT COALESCE(SUM(o.totalAmount), 0)
        FROM Order o
        WHERE o.status = :status
    """)
    BigDecimal sumTotalAmountByStatus(
            @Param("status") OrderStatus status
    );

    @Query("""
        SELECT COALESCE(AVG(o.totalAmount), 0)
        FROM Order o
        WHERE o.status = :status
    """)
    BigDecimal averageTotalAmountByStatus(
            @Param("status") OrderStatus status
    );

    // =========================================================
    // SALES BETWEEN DATES
    // =========================================================

    @Query("""
        SELECT COALESCE(SUM(o.totalAmount), 0)
        FROM Order o
        WHERE o.status = :status
        AND o.createdAt >= :start
        AND o.createdAt < :end
    """)
    BigDecimal sumTotalAmountByStatusBetween(
            @Param("status") OrderStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    // =========================================================
    // ORDER COUNTS BETWEEN DATES
    // =========================================================

    long countByCreatedAtGreaterThanEqualAndCreatedAtLessThan(
            LocalDateTime start,
            LocalDateTime end
    );

    // =========================================================
    // RECENT ORDERS
    // =========================================================

    List<Order> findTop10ByOrderByCreatedAtDesc();


    @Query("""
        SELECT
            o.shop.id,
            o.shop.name,
            o.shop.slug,
            o.shop.owner.username,
            COUNT(o.id),
            COALESCE(SUM(o.totalAmount), 0),
            COALESCE(AVG(o.totalAmount), 0),
            o.shop.active
        FROM Order o
        WHERE o.status = :status
        GROUP BY
            o.shop.id,
            o.shop.name,
            o.shop.slug,
            o.shop.owner.username,
            o.shop.active
        ORDER BY SUM(o.totalAmount) DESC
    """)
    List<Object[]> findTopShopsBySales(
            @Param("status") OrderStatus status
    );
}