package com.bag_shop_api.bag_shop_api.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bag_shop_api.bag_shop_api.DTO.ShopSalesSummary;
import com.bag_shop_api.bag_shop_api.Entity.Shop;
import com.bag_shop_api.bag_shop_api.Entity.User;
import com.bag_shop_api.bag_shop_api.Enums.OrderStatus;

public interface ShopRepository extends JpaRepository<Shop, Long> {


    Optional<Shop> findByOwner(User owner);

    Optional<Shop> findByOwnerId(Long ownerId);

    Optional<Shop> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsByOwnerId(Long ownerId);

    List<Shop> findByActiveTrue();

    Optional<Shop> findBySlugAndActiveTrue(String slug);

    List<Shop> findAllByOrderByNameAsc();
    
    long countByActiveTrue();

	long countByActiveFalse();

   

}


