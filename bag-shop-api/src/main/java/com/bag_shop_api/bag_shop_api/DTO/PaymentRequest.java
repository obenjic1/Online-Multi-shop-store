package com.bag_shop_api.bag_shop_api.DTO;


import com.bag_shop_api.bag_shop_api.Enums.PaymentMethod;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequest {

    @NotNull
    private Long orderId;

    @NotNull
    private PaymentMethod method;

    private String phoneNumber;
}
