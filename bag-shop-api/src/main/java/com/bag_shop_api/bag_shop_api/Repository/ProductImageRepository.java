package com.bag_shop_api.bag_shop_api.Repository;

import com.bag_shop_api.bag_shop_api.Entity.ProductImage;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

    long countByProductId(Long productId);

    List<ProductImage> findByProductIdOrderByDisplayOrderAsc(Long productId);
        Optional<ProductImage> findFirstByProductIdOrderByDisplayOrderAsc(Long productId);

}
