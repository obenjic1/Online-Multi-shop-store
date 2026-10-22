package com.bag_shop_api.bag_shop_api.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecentOrderSummary {

    private Long orderId;
    private String orderNumber;

    private String shopName;
    private String customerName;

    private BigDecimal totalAmount;

    private String status;

    private LocalDateTime createdAt;
}
