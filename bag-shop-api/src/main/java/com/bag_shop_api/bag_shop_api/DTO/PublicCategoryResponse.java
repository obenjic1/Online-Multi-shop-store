package com.bag_shop_api.bag_shop_api.DTO;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PublicCategoryResponse {

    private Long id;
    private String name;
    private Long shopId;
    private String shopName;
    private String shopSlug;
}