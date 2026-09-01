package com.bag_shop_api.bag_shop_api.Service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bag_shop_api.bag_shop_api.DTO.ShopRequest;
import com.bag_shop_api.bag_shop_api.DTO.ShopResponse;
import com.bag_shop_api.bag_shop_api.Entity.Shop;
import com.bag_shop_api.bag_shop_api.Entity.User;
import com.bag_shop_api.bag_shop_api.Enums.Role;
import com.bag_shop_api.bag_shop_api.Repository.ShopRepository;
import com.bag_shop_api.bag_shop_api.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ShopService {

    private final ShopRepository shopRepository;
    private final UserRepository userRepository;

    public ShopResponse create(ShopRequest request) {

        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() ->
                        new RuntimeException("Owner user not found"));

        if (owner.getRole() != Role.ROLE_ADMIN) {

            throw new RuntimeException(
                    "Shop owner must have ADMIN role");
        }

        if (shopRepository.existsByOwnerId(owner.getId())) {

            throw new RuntimeException(
                    "This user already owns a shop");
        }

        String slug =
                generateUniqueSlug(request.getName());

        Shop shop = Shop.builder()
                .name(request.getName())
                .slug(slug)
                .description(
                        request.getDescription())
                .logo(
                        request.getLogo())

                .banner(
                        request.getBanner())

                .themeColor(
                        request.getThemeColor())

                .accentColor(
                        request.getAccentColor())

                .phoneNumber(
                        request.getPhoneNumber())

                .whatsappNumber(
                        request.getWhatsappNumber())

                .email(
                        request.getEmail())

                .address(
                        request.getAddress())

                .city(
                        request.getCity())

                .region(
                        request.getRegion())

                .landmark(
                        request.getLandmark())


                .pickupAvailable(
                        request.isPickupAvailable())

                .deliveryAvailable(
                        request.isDeliveryAvailable())

                .deliveryFee(
                        request.getDeliveryFee())


                .active(true)

                .owner(owner)

                .build();

        return map(
                shopRepository.save(shop)
        );
    }
    private String generateUniqueSlug(String name) {

        String baseSlug = name
                .toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");

        String slug = baseSlug;
        int counter = 1;

        while (shopRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter++;
        }

        return slug;
    }

    private ShopResponse map(Shop shop) {

        return ShopResponse.builder()

                .id(shop.getId())

                .name(shop.getName())

                .slug(shop.getSlug())

                .description(
                        shop.getDescription())

                .logo(
                        shop.getLogo())

                .banner(
                        shop.getBanner())


                .themeColor(
                        shop.getThemeColor())

                .accentColor(
                        shop.getAccentColor())

                .phoneNumber(
                        shop.getPhoneNumber())

                .whatsappNumber(
                        shop.getWhatsappNumber())

                .email(
                        shop.getEmail())

                .address(
                        shop.getAddress())

                .city(
                        shop.getCity())

                .region(
                        shop.getRegion())

                .landmark(
                        shop.getLandmark())


                .pickupAvailable(
                        shop.isPickupAvailable())

                .deliveryAvailable(
                        shop.isDeliveryAvailable())

                .deliveryFee(
                        shop.getDeliveryFee())


                .active(
                        shop.isActive())

                .ownerId(
                        shop.getOwner().getId())

                .ownerUsername(
                        shop.getOwner().getUsername())

                .build();
    }
}