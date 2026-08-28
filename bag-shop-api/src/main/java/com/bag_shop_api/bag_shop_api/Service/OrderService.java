package com.bag_shop_api.bag_shop_api.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bag_shop_api.bag_shop_api.DTO.OrderItemRequest;
import com.bag_shop_api.bag_shop_api.DTO.OrderItemResponse;
import com.bag_shop_api.bag_shop_api.DTO.OrderRequest;
import com.bag_shop_api.bag_shop_api.DTO.OrderResponse;
import com.bag_shop_api.bag_shop_api.Entity.Order;
import com.bag_shop_api.bag_shop_api.Entity.OrderItem;
import com.bag_shop_api.bag_shop_api.Entity.Product;
import com.bag_shop_api.bag_shop_api.Enums.FulfillmentType;
import com.bag_shop_api.bag_shop_api.Enums.OrderStatus;
import com.bag_shop_api.bag_shop_api.Repository.OrderItemRepository;
import com.bag_shop_api.bag_shop_api.Repository.OrderRepository;
import com.bag_shop_api.bag_shop_api.Repository.ProductRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

        private final OrderRepository orderRepository;
        private final OrderItemRepository orderItemRepository;
        private final ProductRepository productRepository;

        @Transactional
        public OrderResponse createOrder(OrderRequest request) {

                BigDecimal subtotal = BigDecimal.ZERO;

                Order order = new Order();

                order.setOrderNumber(generateOrderNumber());
                order.setStatus(OrderStatus.PENDING);
                order.setFulfillmentType(request.getFulfillmentType());

                order.setCustomerName(request.getCustomerName());
                order.setCustomerPhone(request.getCustomerPhone());
                order.setCustomerEmail(request.getCustomerEmail());

                // Delivery information
                if (request.getFulfillmentType() == FulfillmentType.DELIVERY) {

                        if (request.getDeliveryAddress() == null
                                        || request.getDeliveryAddress().isBlank()) {

                                throw new RuntimeException(
                                                "Delivery address is required for delivery orders");
                        }

                        if (request.getDeliveryCity() == null
                                        || request.getDeliveryCity().isBlank()) {

                                throw new RuntimeException(
                                                "Delivery city is required for delivery orders");
                        }

                        order.setDeliveryAddress(request.getDeliveryAddress());
                        order.setDeliveryCity(request.getDeliveryCity());
                }

                order.setCreatedAt(LocalDateTime.now());

                // Store the items temporarily
                List<OrderItem> orderItems = new ArrayList<>();

                // Process cart items
                for (OrderItemRequest itemRequest : request.getItems()) {

                        Product product = productRepository
                                        .findById(itemRequest.getProductId())
                                        .orElseThrow(() -> new RuntimeException(
                                                        "Product not found: "
                                                                        + itemRequest.getProductId()));

                        // Check active
                        if (!product.isActive()) {

                                throw new RuntimeException(
                                                "Product is no longer available: "
                                                                + product.getName());
                        }

                        // Check stock
                        if (itemRequest.getQuantity() > product.getStockQuantity()) {

                                throw new RuntimeException(
                                                "Insufficient stock for: "
                                                                + product.getName());
                        }

                        BigDecimal unitPrice = product.getPrice();

                        BigDecimal itemSubtotal = unitPrice.multiply(
                                        BigDecimal.valueOf(
                                                        itemRequest.getQuantity()));

                        OrderItem orderItem = OrderItem.builder()
                                .order(order)
                                .product(product)
                                .quantity(itemRequest.getQuantity())
                                .unitPrice(unitPrice)
                                .subtotal(itemSubtotal)
                                .build();

                        orderItems.add(orderItem);
                        order.getItems().add(orderItem);

                        subtotal = subtotal.add(itemSubtotal);
                        subtotal = subtotal.add(itemSubtotal);

                        // Reduce stock
                        product.setStockQuantity(
                                        product.getStockQuantity()
                                                        - itemRequest.getQuantity());

                        productRepository.save(product);
                }

                // Set totals BEFORE saving order
                order.setSubtotal(subtotal);
                order.setTotalAmount(subtotal);

                // Now order can safely be saved
                orderRepository.save(order);

                // Save order items
                orderItemRepository.saveAll(orderItems);

                return map(order);
        }

        private String generateOrderNumber() {

                return "ORD-"
                                + System.currentTimeMillis();
        }

        private OrderResponse map(Order order) {

                return OrderResponse.builder()
                                .id(order.getId())
                                .orderNumber(order.getOrderNumber())
                                .status(order.getStatus())
                                .fulfillmentType(order.getFulfillmentType())
                                .subtotal(order.getSubtotal())
                                .totalAmount(order.getTotalAmount())
                                .customerName(order.getCustomerName())
                                .customerPhone(order.getCustomerPhone())
                                .customerEmail(order.getCustomerEmail())
                                .deliveryAddress(order.getDeliveryAddress())
                                .deliveryCity(order.getDeliveryCity())
                                .createdAt(order.getCreatedAt())
                                .items(
                                                order.getItems()
                                                                .stream()
                                                                .map(item -> OrderItemResponse.builder()
                                                                                .productId(item.getProduct().getId())
                                                                                .productName(item.getProduct()
                                                                                                .getName())
                                                                                .quantity(item.getQuantity())
                                                                                .unitPrice(item.getUnitPrice())
                                                                                .subtotal(item.getSubtotal())
                                                                                .build())
                                                                .toList()

                                )
                                .build();
        }
}
