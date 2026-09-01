package com.bag_shop_api.bag_shop_api.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bag_shop_api.bag_shop_api.DTO.PublicCategoryResponse;
import com.bag_shop_api.bag_shop_api.Service.PublicCategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/public/categories")
@RequiredArgsConstructor
public class PublicCategoryController {

    private final PublicCategoryService publicCategoryService;

    @GetMapping
    public ResponseEntity<List<PublicCategoryResponse>> findAll() {

        return ResponseEntity.ok(
                publicCategoryService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PublicCategoryResponse> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                publicCategoryService.findById(id));
    }

    @GetMapping("/shop/{slug}")
    public ResponseEntity<List<PublicCategoryResponse>> findByShop(
            @PathVariable String slug) {

        return ResponseEntity.ok(
                publicCategoryService.findByShopSlug(slug));
    }

    @GetMapping("/shop/{slug}/{categoryId}")
    public ResponseEntity<PublicCategoryResponse> findShopCategory(
            @PathVariable String slug,
            @PathVariable Long categoryId) {

        return ResponseEntity.ok(
                publicCategoryService.findByShopSlugAndId(
                        slug,
                        categoryId));
    }
}