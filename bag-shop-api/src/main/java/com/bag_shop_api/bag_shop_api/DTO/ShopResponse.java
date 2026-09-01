package com.bag_shop_api.bag_shop_api.DTO;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ShopResponse {

  
    private Long id;

    private String name;

    private String slug;

    private String description;

    private String logo;

    private String banner;


    private String themeColor;

    private String accentColor;



    private String phoneNumber;

    private String whatsappNumber;

    private String email;


        // LOCATION
    
    private String address;

    private String city;

    private String region;

    private String landmark;


        // ORDER OPTIONS
    
    private boolean pickupAvailable;

    private boolean deliveryAvailable;

    private BigDecimal deliveryFee;


    
    private boolean active;


    // OWNER

    private Long ownerId;

    private String ownerUsername;
}