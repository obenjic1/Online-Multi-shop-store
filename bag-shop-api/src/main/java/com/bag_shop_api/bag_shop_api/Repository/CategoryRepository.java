package com.bag_shop_api.bag_shop_api.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bag_shop_api.bag_shop_api.Entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
