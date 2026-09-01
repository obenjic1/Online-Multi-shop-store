package com.bag_shop_api.bag_shop_api.Config;

import com.bag_shop_api.bag_shop_api.Entity.User;
import com.bag_shop_api.bag_shop_api.Enums.Role;
import com.bag_shop_api.bag_shop_api.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (userRepository.findByUsername("superadmin").isEmpty()) {

            User superAdmin = User.builder()
                    .username("superadmin")
                    .email("superadmin@bagshop.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ROLE_SUPER_ADMIN)
                    .enabled(true)
                    .build();

            userRepository.save(superAdmin);

        }
    }
}
