package com.bag_shop_api.bag_shop_api.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bag_shop_api.bag_shop_api.DTO.ProductResponse;
import com.bag_shop_api.bag_shop_api.Service.PublicProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/public/products")
@RequiredArgsConstructor
public class PublicProductController {

    private final PublicProductService publicProductService;

    
    @GetMapping
    public ResponseEntity<List<ProductResponse>> findAll() {

        return ResponseEntity.ok(
                publicProductService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                publicProductService.findById(id));
    }

    /**
     * Products belonging to one shop.
     */
    @GetMapping("/shop/{slug}")
    public ResponseEntity<List<ProductResponse>> findByShop(
            @PathVariable String slug) {

        return ResponseEntity.ok(
                publicProductService.findByShopSlug(slug));
    }

    /**
     * One product belonging to one specific shop.
     */
    @GetMapping("/shop/{slug}/{productId}")
    public ResponseEntity<ProductResponse> findShopProduct(
            @PathVariable String slug,
            @PathVariable Long productId) {

        return ResponseEntity.ok(
                publicProductService.findByShopSlugAndProductId(
                        slug,
                        productId));
    }
}