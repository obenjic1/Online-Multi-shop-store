package com.bag_shop_api.bag_shop_api.DTO;

public record ProductImageResponse(
        Long id,
        String imageUrl,
        String originalFileName,
        boolean primaryImage,
        Integer displayOrder) {
}
