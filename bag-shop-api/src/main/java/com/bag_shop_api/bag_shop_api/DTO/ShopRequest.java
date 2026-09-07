package com.bag_shop_api.bag_shop_api.DTO;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShopRequest {

    // =========================================================
    // STORE IDENTITY
    // =========================================================

    @NotBlank
    private String name;

    private String description;

    private String logo;

    private String banner;


    // =========================================================
    // THEME
    // =========================================================

    private String themeColor;

    private String accentColor;


    // =========================================================
    // CONTACT
    // =========================================================

    private String phoneNumber;

    private String whatsappNumber;

    private String email;


    // =========================================================
    // LOCATION
    // =========================================================

    private String address;

    private String city;

    private String region;

    private String landmark;


    // =========================================================
    // ORDER OPTIONS
    // =========================================================

    private boolean pickupAvailable = true;

    private boolean deliveryAvailable = true;

    private BigDecimal deliveryFee;


    // =========================================================
    // OWNER
    // =========================================================

   
}
