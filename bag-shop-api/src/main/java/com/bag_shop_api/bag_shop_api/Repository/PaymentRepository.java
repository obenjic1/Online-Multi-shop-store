package com.bag_shop_api.bag_shop_api.Repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bag_shop_api.bag_shop_api.Entity.Payment;

public interface PaymentRepository
        extends JpaRepository<Payment, Long> {

    Optional<Payment> findByOrderId(Long orderId);

    Optional<Payment> findByTransactionReference(
            String transactionReference
    );

    boolean existsByOrderId(Long orderId);
}
