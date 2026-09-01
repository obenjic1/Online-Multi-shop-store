package com.bag_shop_api.bag_shop_api.DTO;

import com.bag_shop_api.bag_shop_api.Enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateUserRequest {

    @NotBlank
    private String username;

    @Email
    private String email;

    private String phoneNumber;

    /*
     * Optional during update.
     * If blank/null, the existing password remains unchanged.
     */
    private String password;

    @NotNull
    private Role role;
}