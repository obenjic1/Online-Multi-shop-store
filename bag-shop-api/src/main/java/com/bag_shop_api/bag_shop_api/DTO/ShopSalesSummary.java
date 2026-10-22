package com.bag_shop_api.bag_shop_api.DTO;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShopSalesSummary {

    private Long shopId;
    private String shopName;
    private String shopSlug;

    private String ownerUsername;

    private long totalOrders;
    private long totalProducts;

    private BigDecimal totalSales;
    private BigDecimal averageOrderValue;

    private boolean active;
}