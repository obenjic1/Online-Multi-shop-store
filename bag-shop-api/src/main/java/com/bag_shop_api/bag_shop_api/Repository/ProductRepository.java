package com.bag_shop_api.bag_shop_api.Repository;

import com.bag_shop_api.bag_shop_api.Entity.Product;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @EntityGraph(attributePaths = { "images", "category" })
    List<Product> findByActiveTrue();

    @EntityGraph(attributePaths = { "images", "category" })
    Optional<Product> findWithImagesById(Long id);

    List<Product> findByCategoryIdAndActiveTrue(Long categoryId);

}