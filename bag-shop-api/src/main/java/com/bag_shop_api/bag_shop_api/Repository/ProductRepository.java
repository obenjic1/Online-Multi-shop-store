package com.bag_shop_api.bag_shop_api.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.bag_shop_api.bag_shop_api.Entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

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

	    List<Product> findByCategoryIdAndActiveTrue(Long categoryId);

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
	    Optional<Product> findByIdAndShopId(Long id, Long shopId);
}
