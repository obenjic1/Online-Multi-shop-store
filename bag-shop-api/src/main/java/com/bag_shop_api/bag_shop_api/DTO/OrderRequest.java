package com.bag_shop_api.bag_shop_api.DTO;

import java.util.List;

import com.bag_shop_api.bag_shop_api.Enums.FulfillmentType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderRequest {

    @NotBlank
    private String customerName;

    @NotBlank
    private String customerPhone;

    private String customerEmail;

    @NotNull
    private FulfillmentType fulfillmentType;

    private String deliveryAddress;

    private String deliveryCity;

    @NotEmpty
    private List<OrderItemRequest> items;
}
