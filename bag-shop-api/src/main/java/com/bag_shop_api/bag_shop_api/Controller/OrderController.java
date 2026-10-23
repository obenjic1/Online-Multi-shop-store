package com.bag_shop_api.bag_shop_api.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bag_shop_api.bag_shop_api.DTO.OrderRequest;
import com.bag_shop_api.bag_shop_api.DTO.OrderResponse;
import com.bag_shop_api.bag_shop_api.Enums.OrderStatus;
import com.bag_shop_api.bag_shop_api.Service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody OrderRequest request) {

        return ResponseEntity.ok(
                orderService.createOrder(request));
    }
    
    @GetMapping("/shop")
    public ResponseEntity<List<OrderResponse>> getMyShopOrders() {

        return ResponseEntity.ok(
                orderService.getMyShopOrders()
        );
    }
    
    @GetMapping("/shop/{id}")
    public ResponseEntity<OrderResponse> getMyShopOrder(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                orderService.getMyShopOrder(id)
        );
    }
    @PatchMapping("/shop/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {

        return ResponseEntity.ok(
                orderService.updateOrderStatus(id, status)
        );
    }
}
