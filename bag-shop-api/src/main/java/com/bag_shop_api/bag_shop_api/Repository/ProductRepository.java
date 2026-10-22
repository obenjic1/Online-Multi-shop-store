package com.bag_shop_api.bag_shop_api.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.bag_shop_api.bag_shop_api.Entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // =========================================================
    // PUBLIC PRODUCTS
    // =========================================================

    @EntityGraph(attributePaths = {
            "images",
            "category",
            "shop"
    })
    List<Product> findByActiveTrue();

    @EntityGraph(attributePaths = {
            "images",
            "category",
            "shop"
    })
    Optional<Product> findWithImagesById(Long id);

    @EntityGraph(attributePaths = {
            "images",
            "category",
            "shop"
    })
    List<Product> findByCategoryIdAndActiveTrue(Long categoryId);

    // =========================================================
    // SHOP PRODUCTS
    // =========================================================

    @EntityGraph(attributePaths = {
            "images",
            "category",
            "shop"
    })
    List<Product> findByShopIdAndActiveTrue(Long shopId);

    @EntityGraph(attributePaths = {
            "images",
            "category",
            "shop"
    })
    Optional<Product> findByIdAndShopId(
            Long id,
            Long shopId
    );

    // =========================================================
    // PRODUCT STATISTICS
    // =========================================================

    long countByActiveTrue();

    long countByActiveFalse();

    long countByStockQuantity(Integer stockQuantity);

    long countByStockQuantityGreaterThanAndStockQuantityLessThanEqual(
            Integer minimum,
            Integer maximum
    );

    // =========================================================
    // PRODUCT COUNT PER SHOP
    // =========================================================

    @Query("""
        SELECT
            p.shop.id,
            COUNT(p.id)
        FROM Product p
        GROUP BY p.shop.id
    """)
    List<Object[]> countProductsByShop();
}