package com.bag_shop_api.bag_shop_api.DTO;

import com.bag_shop_api.bag_shop_api.Enums.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {

    private Long id;

    private String username;
    private String phoneNumber;
    private String email;

    private Role role;

    private boolean enabled;
}