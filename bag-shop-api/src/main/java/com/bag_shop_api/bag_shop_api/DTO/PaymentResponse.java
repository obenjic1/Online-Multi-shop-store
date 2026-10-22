package com.bag_shop_api.bag_shop_api.DTO;


import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.bag_shop_api.bag_shop_api.Enums.PaymentMethod;
import com.bag_shop_api.bag_shop_api.Enums.PaymentStatus;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PaymentResponse {

    private Long id;

    private Long orderId;

    private String orderNumber;

    private BigDecimal amount;

    private PaymentMethod method;

    private PaymentStatus status;

    private String transactionReference;

    private String externalReference;

    private String phoneNumber;

    private LocalDateTime createdAt;

    private LocalDateTime paidAt;

    private LocalDateTime updatedAt;
}
