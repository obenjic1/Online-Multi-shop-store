package com.bag_shop_api.bag_shop_api.Entity;


import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "shops",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "slug")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =========================================================
    // STORE IDENTITY
    // =========================================================

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(length = 1000)
    private String description;

    private String logo;

    private String banner;


    // =========================================================
    // THEME
    // =========================================================

    @Column(length = 20)
    private String themeColor;

    @Column(length = 20)
    private String accentColor;


    // =========================================================
    // CONTACT
    // =========================================================

    private String phoneNumber;

    private String whatsappNumber;

    private String email;


    // =========================================================
    // PHYSICAL LOCATION
    // =========================================================

    private String address;

    private String city;

    private String region;

    private String landmark;
    private double longitude;
    private double latitude;


    // =========================================================
    // ORDER OPTIONS
    // =========================================================

    @Column(nullable = false)
    @Builder.Default
    private boolean pickupAvailable = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean deliveryAvailable = true;

    @Column(precision = 12, scale = 2)
    private BigDecimal deliveryFee;


    // =========================================================
    // STATUS
    // =========================================================

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;


    // =========================================================
    // OWNER
    // =========================================================

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "owner_id",
        nullable = false,
        unique = true
    )
    private User owner;
}