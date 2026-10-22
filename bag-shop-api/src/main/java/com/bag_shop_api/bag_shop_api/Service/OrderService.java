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
import com.bag_shop_api.bag_shop_api.Entity.Shop;
import com.bag_shop_api.bag_shop_api.Enums.FulfillmentType;
import com.bag_shop_api.bag_shop_api.Enums.OrderStatus;
import com.bag_shop_api.bag_shop_api.Repository.OrderItemRepository;
import com.bag_shop_api.bag_shop_api.Repository.OrderRepository;
import com.bag_shop_api.bag_shop_api.Repository.ProductRepository;
import com.bag_shop_api.bag_shop_api.Repository.ShopRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    private final OrderItemRepository orderItemRepository;

    private final ProductRepository productRepository;

    private final ShopRepository shopRepository;
    private final CurrentUserService currentUserService;


   
    @Transactional
    public OrderResponse createOrder(OrderRequest request) {

        
        Shop shop = shopRepository
                .findBySlug(request.getShopSlug())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Shop not found: "
                                        + request.getShopSlug()
                        )
                );


  

        if (!shop.isActive()) {

            throw new RuntimeException(
                    "This shop is currently unavailable."
            );
        }


 

        if (request.getFulfillmentType() == FulfillmentType.DELIVERY) {

            if (
                request.getDeliveryAddress() == null
                || request.getDeliveryAddress().isBlank()
            ) {

                throw new RuntimeException(
                        "Delivery address is required for delivery orders."
                );
            }


            if (
                request.getDeliveryCity() == null
                || request.getDeliveryCity().isBlank()
            ) {

                throw new RuntimeException(
                        "Delivery city is required for delivery orders."
                );
            }
        }




        BigDecimal subtotal = BigDecimal.ZERO;

        List<OrderItem> orderItems = new ArrayList<>();


        for (OrderItemRequest itemRequest : request.getItems()) {

 

            Product product = productRepository
                    .findById(itemRequest.getProductId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Product not found: "
                                            + itemRequest.getProductId()
                            )
                    );


          

            if (
                product.getShop() == null
                || !product.getShop()
                        .getId()
                        .equals(shop.getId())
            ) {

                throw new RuntimeException(
                        "Product does not belong to this shop: "
                                + product.getName()
                );
            }



            if (!product.isActive()) {

                throw new RuntimeException(
                        "Product is no longer available: "
                                + product.getName()
                );
            }


      

            if (
                itemRequest.getQuantity() >
                product.getStockQuantity()
            ) {

                throw new RuntimeException(
                        "Insufficient stock for: "
                                + product.getName()
                );
            }


            // -------------------------------------------------
            // CALCULATE PRICE
            // -------------------------------------------------

            BigDecimal unitPrice =
                    product.getPrice();

            BigDecimal itemSubtotal =
                    unitPrice.multiply(
                            BigDecimal.valueOf(
                                    itemRequest.getQuantity()
                            )
                    );


            // -------------------------------------------------
            // CREATE ORDER ITEM
            // -------------------------------------------------

            OrderItem orderItem =
                    OrderItem.builder()
                            .product(product)
                            .quantity(
                                    itemRequest.getQuantity()
                            )
                            .unitPrice(unitPrice)
                            .subtotal(itemSubtotal)
                            .build();


            orderItems.add(orderItem);


            // -------------------------------------------------
            // UPDATE TOTAL
            // -------------------------------------------------

            subtotal =
                    subtotal.add(itemSubtotal);
        }


        // =====================================================
        // CREATE ORDER
        // =====================================================

        Order order = new Order();

        order.setOrderNumber(
                generateOrderNumber()
        );

        order.setShop(shop);

        order.setStatus(
                OrderStatus.PENDING
        );

        order.setFulfillmentType(
                request.getFulfillmentType()
        );

        order.setCustomerName(
                request.getCustomerName()
        );

        order.setCustomerPhone(
                request.getCustomerPhone()
        );

        order.setCustomerEmail(
                request.getCustomerEmail()
        );

        order.setCreatedAt(
                LocalDateTime.now()
        );


        // =====================================================
        // DELIVERY INFORMATION
        // =====================================================

        if (
            request.getFulfillmentType()
                == FulfillmentType.DELIVERY
        ) {

            order.setDeliveryAddress(
                    request.getDeliveryAddress()
            );

            order.setDeliveryCity(
                    request.getDeliveryCity()
            );
        }


        // =====================================================
        // TOTALS
        // =====================================================

        order.setSubtotal(subtotal);

        order.setTotalAmount(subtotal);


        // =====================================================
        // CONNECT ORDER ITEMS
        // =====================================================

        for (OrderItem orderItem : orderItems) {

            orderItem.setOrder(order);

            order.getItems().add(orderItem);
        }


        // =====================================================
        // REDUCE STOCK
        // =====================================================

        for (OrderItemRequest itemRequest :
                request.getItems()) {

            Product product =
                    productRepository
                            .findById(
                                    itemRequest.getProductId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Product not found."
                                    )
                            );


            product.setStockQuantity(
                    product.getStockQuantity()
                            - itemRequest.getQuantity()
            );

            productRepository.save(product);
        }


        // =====================================================
        // SAVE ORDER
        // =====================================================

        orderRepository.save(order);


        // =====================================================
        // SAVE ORDER ITEMS
        // =====================================================

        orderItemRepository.saveAll(
                orderItems
        );


        // =====================================================
        // RETURN RESPONSE
        // =====================================================

        return map(order);
    }


    // =========================================================
    // GENERATE ORDER NUMBER
    // =========================================================

    private String generateOrderNumber() {

        return "ORD-"
                + System.currentTimeMillis();
    }


    // =========================================================
    // MAP RESPONSE
    // =========================================================

    private OrderResponse map(Order order) {

        Shop shop = order.getShop();


        return OrderResponse.builder()

                .id(order.getId())

                .orderNumber(
                        order.getOrderNumber()
                )

                // -------------------------------------------------
                // SHOP
                // -------------------------------------------------

                .shopId(
                        shop.getId()
                )

                .shopName(
                        shop.getName()
                )

                .shopSlug(
                        shop.getSlug()
                )

                // -------------------------------------------------
                // ORDER
                // -------------------------------------------------

                .status(
                        order.getStatus()
                )

                .fulfillmentType(
                        order.getFulfillmentType()
                )

                .subtotal(
                        order.getSubtotal()
                )

                .totalAmount(
                        order.getTotalAmount()
                )

                // -------------------------------------------------
                // CUSTOMER
                // -------------------------------------------------

                .customerName(
                        order.getCustomerName()
                )

                .customerPhone(
                        order.getCustomerPhone()
                )

                .customerEmail(
                        order.getCustomerEmail()
                )

                // -------------------------------------------------
                // DELIVERY
                // -------------------------------------------------

                .deliveryAddress(
                        order.getDeliveryAddress()
                )

                .deliveryCity(
                        order.getDeliveryCity()
                )

                // -------------------------------------------------
                // DATE
                // -------------------------------------------------

                .createdAt(
                        order.getCreatedAt()
                )
                .deliveryFee(
                        order.getFulfillmentType() == FulfillmentType.DELIVERY
                        ? shop.getDeliveryFee()
                        : BigDecimal.ZERO
        )

                // -------------------------------------------------
                // ITEMS
                // -------------------------------------------------

                .items(
                        order.getItems()
                                .stream()
                                .map(item ->
                                        OrderItemResponse
                                                .builder()

                                                .productId(
                                                        item.getProduct()
                                                                .getId()
                                                )

                                                .productName(
                                                        item.getProduct()
                                                                .getName()
                                                )

                                                .quantity(
                                                        item.getQuantity()
                                                )

                                                .unitPrice(
                                                        item.getUnitPrice()
                                                )

                                                .subtotal(
                                                        item.getSubtotal()
                                                )

                                                .build()
                                )
                                .toList()
                )

                .build();
    }
    
    public List<OrderResponse> getMyShopOrders() {

        Shop shop = currentUserService.getCurrentShop();

        return orderRepository
                .findByShopIdOrderByCreatedAtDesc(shop.getId())
                .stream()
                .map(this::map)
                .toList();
    }
   
    public OrderResponse getMyShopOrder(Long orderId) {

        Shop shop = currentUserService.getCurrentShop();

        Order order = orderRepository
                .findByIdAndShopId(orderId, shop.getId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found."
                        )
                );

        return map(order);
    }
    
    @Transactional
    public OrderResponse updateOrderStatus(
            Long orderId,
            OrderStatus newStatus) {

        Shop shop = currentUserService.getCurrentShop();

        Order order = orderRepository
                .findByIdAndShopId(orderId, shop.getId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found."
                        )
                );

        OrderStatus currentStatus = order.getStatus();

        // ---------------------------------------------------------
        // CANCELLED ORDERS CANNOT BE CHANGED
        // ---------------------------------------------------------

        if (currentStatus == OrderStatus.CANCELLED) {
            throw new RuntimeException(
                    "A cancelled order cannot be updated."
            );
        }

        // ---------------------------------------------------------
        // DELIVERED ORDERS CANNOT BE CHANGED
        // ---------------------------------------------------------

        if (currentStatus == OrderStatus.DELIVERED) {
            throw new RuntimeException(
                    "A delivered order cannot be updated."
            );
        }

        // ---------------------------------------------------------
        // CANCELLATION
        // ---------------------------------------------------------

        if (newStatus == OrderStatus.CANCELLED) {

            for (OrderItem item : order.getItems()) {

                Product product = item.getProduct();

                product.setStockQuantity(
                        product.getStockQuantity()
                                + item.getQuantity()
                );

                productRepository.save(product);
            }

            order.setStatus(OrderStatus.CANCELLED);

            return map(orderRepository.save(order));
        }

        // ---------------------------------------------------------
        // NORMAL ORDER FLOW
        // ---------------------------------------------------------

        boolean validTransition =
                (currentStatus == OrderStatus.PENDING
                        && newStatus == OrderStatus.CONFIRMED)

                || (currentStatus == OrderStatus.CONFIRMED
                        && newStatus == OrderStatus.PROCESSING)

                || (currentStatus == OrderStatus.PROCESSING
                        && newStatus == OrderStatus.SHIPPED)

                || (currentStatus == OrderStatus.SHIPPED
                        && newStatus == OrderStatus.DELIVERED);

        if (!validTransition) {
            throw new RuntimeException(
                    "Invalid order status transition: "
                            + currentStatus
                            + " → "
                            + newStatus
            );
        }

        order.setStatus(newStatus);

        return map(orderRepository.save(order));
    }
}
