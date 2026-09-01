package com.bag_shop_api.bag_shop_api.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {

    private String token;

    private String username;

    private String role;
}