package com.bag_shop_api.bag_shop_api.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import com.bag_shop_api.bag_shop_api.Enums.FulfillmentType;
import com.bag_shop_api.bag_shop_api.Enums.OrderStatus;
import java.util.List;
import com.bag_shop_api.bag_shop_api.DTO.OrderItemResponse;

@Setter
@Getter
@Builder
public class OrderResponse {

    private Long id;

    private String orderNumber;

    private OrderStatus status;

    private FulfillmentType fulfillmentType;

    private BigDecimal subtotal;

    private BigDecimal totalAmount;

    private String customerName;

    private String customerPhone;

    private String customerEmail;

    private String deliveryAddress;

    private String deliveryCity;

    private LocalDateTime createdAt;
    
    private List<OrderItemResponse> items;
}
