package com.bag_shop_api.bag_shop_api.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bag_shop_api.bag_shop_api.Entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByShopId(Long shopId);

    Optional<Category> findByIdAndShopId(Long id, Long shopId);

    boolean existsByNameAndShopId(String name, Long shopId);
    List<Category> findAllByShopActiveTrue();
}
