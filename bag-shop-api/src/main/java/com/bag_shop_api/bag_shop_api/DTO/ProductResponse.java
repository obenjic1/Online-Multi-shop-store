package com.bag_shop_api.bag_shop_api.DTO;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
public class ProductResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private boolean active;

    private Long categoryId;
    private String categoryName;

    private List<String> images;
    private Long shopId;
	private String shopName;
	private String shopSlug;
}
