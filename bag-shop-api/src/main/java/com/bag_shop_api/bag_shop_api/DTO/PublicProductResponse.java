package com.bag_shop_api.bag_shop_api.DTO;

import java.math.BigDecimal;
import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PublicProductResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private boolean active;

    private Long categoryId;
    private String categoryName;

    private Long shopId;
    private String shopName;
    private String shopSlug;

    private List<String> images;
}