package com.bag_shop_api.bag_shop_api.DTO;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PublicShopPageResponse {

	 private PublicShopResponse shop;
    private List<PublicCategoryResponse> categories;

    private List<ProductResponse> products;
}