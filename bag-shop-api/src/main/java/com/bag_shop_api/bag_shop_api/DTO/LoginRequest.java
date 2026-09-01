package com.bag_shop_api.bag_shop_api.DTO;

import lombok.Data;

@Data
public class LoginRequest {

    private String username;

    private String password;
}