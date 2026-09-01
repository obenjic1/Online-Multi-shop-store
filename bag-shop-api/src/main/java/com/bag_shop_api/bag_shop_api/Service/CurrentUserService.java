package com.bag_shop_api.bag_shop_api.Service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.bag_shop_api.bag_shop_api.Entity.Shop;
import com.bag_shop_api.bag_shop_api.Entity.User;
import com.bag_shop_api.bag_shop_api.Repository.ShopRepository;
import com.bag_shop_api.bag_shop_api.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CurrentUserService {

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;

    public User getCurrentUser() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException("User is not authenticated");
        }

      
        String username = authentication.getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Current user not found"+ username));
    }

    public Shop getCurrentShop() {

        User user = getCurrentUser();

        return shopRepository.findByOwnerId(user.getId())
                .orElseThrow(() -> new RuntimeException(
                        "Current user is not assigned to a shop"));
    }
}