package com.bag_shop_api.bag_shop_api.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bag_shop_api.bag_shop_api.DTO.PublicShopPageResponse;
import com.bag_shop_api.bag_shop_api.DTO.PublicShopResponse;
import com.bag_shop_api.bag_shop_api.Service.PublicShopService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/public/shops")
@RequiredArgsConstructor
public class PublicShopController {

    private final PublicShopService publicShopService;

    /**
     * Public marketplace - all active shops.
     */
    @GetMapping
    public ResponseEntity<List<PublicShopResponse>> findAll() {

        return ResponseEntity.ok(
                publicShopService.findAll());
    }

    /**
     * Public storefront - one shop by slug.
     */
    @GetMapping("/{slug}")
    public ResponseEntity<PublicShopResponse> findBySlug(
            @PathVariable String slug) {

        return ResponseEntity.ok(
                publicShopService.findBySlug(slug));
    }
    
    @GetMapping("/{slug}/page")
    public ResponseEntity<PublicShopPageResponse> getShopPage(
            @PathVariable String slug) {

        return ResponseEntity.ok(
                publicShopService.getShopPage(slug));
    }
}