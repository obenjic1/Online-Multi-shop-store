package com.bag_shop_api.bag_shop_api.Service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bag_shop_api.bag_shop_api.DTO.PublicCategoryResponse;
import com.bag_shop_api.bag_shop_api.Entity.Category;
import com.bag_shop_api.bag_shop_api.Entity.Shop;
import com.bag_shop_api.bag_shop_api.Repository.CategoryRepository;
import com.bag_shop_api.bag_shop_api.Repository.ShopRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PublicCategoryService {

    private final CategoryRepository categoryRepository;
    private final ShopRepository shopRepository;

    public List<PublicCategoryResponse> findAll() {

        return categoryRepository.findAll()
                .stream()
                .filter(category ->
                        category.getShop() != null &&
                        category.getShop().isActive())
                .map(this::map)
                .toList();
    }

    public List<PublicCategoryResponse> findByShopSlug(String slug) {

        Shop shop = shopRepository.findBySlug(slug)
                .orElseThrow(() ->
                        new RuntimeException("Shop not found"));

        if (!shop.isActive()) {
            throw new RuntimeException("Shop is not active");
        }

        return categoryRepository
                .findByShopId(shop.getId())
                .stream()
                .map(this::map)
                .toList();
    }

    public PublicCategoryResponse findById(Long id) {

        Category category = categoryRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        if (category.getShop() == null ||
                !category.getShop().isActive()) {

            throw new RuntimeException("Category not found");
        }

        return map(category);
    }

    public PublicCategoryResponse findByShopSlugAndId(
            String slug,
            Long categoryId) {

        Shop shop = shopRepository.findBySlug(slug)
                .orElseThrow(() ->
                        new RuntimeException("Shop not found"));

        if (!shop.isActive()) {
            throw new RuntimeException("Shop is not active");
        }

        Category category = categoryRepository
                .findByIdAndShopId(categoryId, shop.getId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        return map(category);
    }

    private PublicCategoryResponse map(Category category) {

        Shop shop = category.getShop();

        return PublicCategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .shopId(shop.getId())
                .shopName(shop.getName())
                .shopSlug(shop.getSlug())
                .build();
    }
}