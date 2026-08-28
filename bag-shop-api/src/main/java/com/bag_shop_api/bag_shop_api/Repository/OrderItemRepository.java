package com.bag_shop_api.bag_shop_api.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bag_shop_api.bag_shop_api.Entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}