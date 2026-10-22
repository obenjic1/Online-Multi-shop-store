package com.bag_shop_api.bag_shop_api.Service;


import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bag_shop_api.bag_shop_api.DTO.PaymentRequest;
import com.bag_shop_api.bag_shop_api.DTO.PaymentResponse;
import com.bag_shop_api.bag_shop_api.Entity.Order;
import com.bag_shop_api.bag_shop_api.Entity.Payment;
import com.bag_shop_api.bag_shop_api.Enums.OrderStatus;
import com.bag_shop_api.bag_shop_api.Enums.PaymentMethod;
import com.bag_shop_api.bag_shop_api.Enums.PaymentStatus;
import com.bag_shop_api.bag_shop_api.Repository.OrderRepository;
import com.bag_shop_api.bag_shop_api.Repository.PaymentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    // =========================================================
    // INITIATE PAYMENT
    // =========================================================

    @Transactional
    public PaymentResponse initiatePayment(
            PaymentRequest request) {

        // -----------------------------------------------------
        // FIND ORDER
        // -----------------------------------------------------

        Order order = orderRepository
                .findById(request.getOrderId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found."
                        )
                );

        // -----------------------------------------------------
        // CANCELLED ORDERS CANNOT BE PAID
        // -----------------------------------------------------

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException(
                    "A cancelled order cannot be paid."
            );
        }

        // -----------------------------------------------------
        // CHECK EXISTING PAYMENT
        // -----------------------------------------------------

        if (paymentRepository.existsByOrderId(order.getId())) {

            Payment existingPayment =
                    paymentRepository
                            .findByOrderId(order.getId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Payment record not found."
                                    )
                            );

            if (
                existingPayment.getStatus()
                        == PaymentStatus.SUCCESSFUL
            ) {

                throw new RuntimeException(
                        "This order has already been paid."
                );
            }

            if (
                existingPayment.getStatus()
                        == PaymentStatus.PENDING
            ) {

                return map(existingPayment);
            }
        }

        // -----------------------------------------------------
        // VALIDATE PAYMENT METHOD
        // -----------------------------------------------------

        if (request.getMethod() == null) {

            throw new RuntimeException(
                    "Payment method is required."
            );
        }

        // -----------------------------------------------------
        // MTN MOMO PHONE NUMBER
        // -----------------------------------------------------

        if (
            request.getMethod() == PaymentMethod.MTN_MOMO
            && (
                request.getPhoneNumber() == null
                || request.getPhoneNumber().isBlank()
            )
        ) {

            throw new RuntimeException(
                    "MTN Mobile Money phone number is required."
            );
        }

        // -----------------------------------------------------
        // CREATE PAYMENT
        // -----------------------------------------------------

        Payment payment = Payment.builder()

                .order(order)

                .method(
                        request.getMethod()
                )

                .status(
                        PaymentStatus.PENDING
                )

                .amount(
                        order.getTotalAmount()
                )

                .transactionReference(
                        generateTransactionReference()
                )

                .phoneNumber(
                        request.getPhoneNumber()
                )

                .createdAt(
                        LocalDateTime.now()
                )

                .updatedAt(
                        LocalDateTime.now()
                )

                .build();

        // -----------------------------------------------------
        // SAVE
        // -----------------------------------------------------

        Payment savedPayment =
                paymentRepository.save(payment);

        // -----------------------------------------------------
        // RETURN
        // -----------------------------------------------------

        return map(savedPayment);
    }

    // =========================================================
    // GET PAYMENT BY ORDER
    // =========================================================

    public PaymentResponse getPaymentByOrder(
            Long orderId) {

        Payment payment =
                paymentRepository
                        .findByOrderId(orderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment not found."
                                )
                        );

        return map(payment);
    }

    // =========================================================
    // GENERATE TRANSACTION REFERENCE
    // =========================================================

    private String generateTransactionReference() {

        return "PAY-"
                + UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 12)
                        .toUpperCase();
    }

    // =========================================================
    // MAP RESPONSE
    // =========================================================

    private PaymentResponse map(
            Payment payment) {

        return PaymentResponse.builder()

                .id(
                        payment.getId()
                )

                .orderId(
                        payment.getOrder().getId()
                )

                .orderNumber(
                        payment.getOrder()
                                .getOrderNumber()
                )

                .amount(
                        payment.getAmount()
                )

                .method(
                        payment.getMethod()
                )

                .status(
                        payment.getStatus()
                )

                .transactionReference(
                        payment.getTransactionReference()
                )

                .externalReference(
                        payment.getExternalReference()
                )

                .phoneNumber(
                        payment.getPhoneNumber()
                )

                .createdAt(
                        payment.getCreatedAt()
                )

                .paidAt(
                        payment.getPaidAt()
                )

                .updatedAt(
                        payment.getUpdatedAt()
                )

                .build();
    }
}