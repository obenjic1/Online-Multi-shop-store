package com.bag_shop_api.bag_shop_api.DTO;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PublicShopResponse {

    private Long id;

    private String name;

    private String slug;

    private String description;

    private String logo;

    private String themeColor;

    private String phoneNumber;

    private String whatsappNumber;

    private String email;

    private String address;

    private String city;

    private Double latitude;

    private Double longitude;

    private boolean pickupAvailable;

    private boolean deliveryAvailable;

    private boolean active;
}