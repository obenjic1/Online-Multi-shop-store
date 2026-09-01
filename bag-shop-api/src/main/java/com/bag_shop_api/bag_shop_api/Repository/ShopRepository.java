package com.bag_shop_api.bag_shop_api.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bag_shop_api.bag_shop_api.Entity.Shop;
import com.bag_shop_api.bag_shop_api.Entity.User;

public interface ShopRepository extends JpaRepository<Shop, Long> {

    Optional<Shop> findByOwner(User owner);

    Optional<Shop> findByOwnerId(Long ownerId);

    Optional<Shop> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsByOwnerId(Long ownerId);
    List<Shop> findByActiveTrue();
    
    Optional<Shop> findBySlugAndActiveTrue(String slug);
}