package com.bag_shop_api.bag_shop_api.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bag_shop_api.bag_shop_api.DTO.CategoryResponse;
import com.bag_shop_api.bag_shop_api.Entity.Category;
import com.bag_shop_api.bag_shop_api.Entity.Shop;
import com.bag_shop_api.bag_shop_api.Repository.CategoryRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CurrentUserService currentUserService;

    public CategoryResponse create(Category category) {

        Shop shop = currentUserService.getCurrentShop();

        if (categoryRepository.existsByNameAndShopId(
                category.getName(),
                shop.getId())) {

            throw new RuntimeException(
                    "Category already exists in your shop");
        }

        // Never trust the shop sent by the frontend
        category.setShop(shop);

        return map(categoryRepository.save(category));
    }

    @Transactional
    public List<CategoryResponse> findAll() {

        Shop shop = currentUserService.getCurrentShop();

        return categoryRepository
                .findByShopId(shop.getId())
                .stream()
                .map(this::map)
                .toList();
    }

    @Transactional
    public CategoryResponse findById(Long id) {

        Shop shop = currentUserService.getCurrentShop();

        Category category = categoryRepository
                .findByIdAndShopId(id, shop.getId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        return map(category);
    }

    public CategoryResponse update(
            Long id,
            Category category) {

        Shop shop = currentUserService.getCurrentShop();

        Category existing = categoryRepository
                .findByIdAndShopId(id, shop.getId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        if (!existing.getName().equalsIgnoreCase(category.getName())
                && categoryRepository.existsByNameAndShopId(
                        category.getName(),
                        shop.getId())) {

            throw new RuntimeException(
                    "Category already exists in your shop");
        }

        existing.setName(category.getName());

        return map(categoryRepository.save(existing));
    }

    public void delete(Long id) {

        Shop shop = currentUserService.getCurrentShop();

        Category category = categoryRepository
                .findByIdAndShopId(id, shop.getId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        categoryRepository.delete(category);
    }

    private CategoryResponse map(Category category) {

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .shopId(category.getShop().getId())
                .shopName(category.getShop().getName())
                .build();
    }
}