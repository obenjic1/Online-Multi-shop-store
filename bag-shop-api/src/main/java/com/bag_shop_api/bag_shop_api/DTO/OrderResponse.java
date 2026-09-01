package com.bag_shop_api.bag_shop_api.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.bag_shop_api.bag_shop_api.Enums.FulfillmentType;
import com.bag_shop_api.bag_shop_api.Enums.OrderStatus;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class OrderResponse {

    private Long id;

    private String orderNumber;

    // =========================================================
    // SHOP
    // =========================================================

    private Long shopId;

    private String shopName;

    private String shopSlug;

    // =========================================================
    // ORDER
    // =========================================================

    private OrderStatus status;

    private FulfillmentType fulfillmentType;

    private BigDecimal subtotal;

    private BigDecimal totalAmount;

    // =========================================================
    // CUSTOMER
    // =========================================================

    private String customerName;

    private String customerPhone;

    private String customerEmail;

    // =========================================================
    // DELIVERY
    // =========================================================

    private String deliveryAddress;

    private String deliveryCity;

    // =========================================================
    // DATE
    // =========================================================

    private LocalDateTime createdAt;

    // =========================================================
    // ITEMS
    // =========================================================

    private List<OrderItemResponse> items;
}
