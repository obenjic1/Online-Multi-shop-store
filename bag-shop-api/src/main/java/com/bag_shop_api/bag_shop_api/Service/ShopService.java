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
    private final CurrentUserService currentUserService;

    public ShopResponse create(ShopRequest request) {

       User owner = currentUserService.getCurrentUser();

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
    
    public ShopResponse getMyShop() {
    User owner = currentUserService.getCurrentUser();

    Shop shop = shopRepository.findByOwnerId(owner.getId())
            .orElseThrow(() ->
                    new RuntimeException("You do not have a shop"));

    return map(shop);}
    
    public ShopResponse updateMyShop(ShopRequest request) {
    User owner = currentUserService.getCurrentUser();

    Shop shop = shopRepository.findByOwnerId(owner.getId())
            .orElseThrow(() ->
                    new RuntimeException("You do not have a shop"));

    shop.setName(request.getName());
    shop.setDescription(request.getDescription());
    shop.setLogo(request.getLogo());
    shop.setBanner(request.getBanner());
    shop.setThemeColor(request.getThemeColor());
    shop.setAccentColor(request.getAccentColor());
    shop.setPhoneNumber(request.getPhoneNumber());
    shop.setWhatsappNumber(request.getWhatsappNumber());
    shop.setEmail(request.getEmail());
    shop.setAddress(request.getAddress());
    shop.setCity(request.getCity());
    shop.setRegion(request.getRegion());
    shop.setLandmark(request.getLandmark());
    shop.setPickupAvailable(request.isPickupAvailable());
    shop.setDeliveryAvailable(request.isDeliveryAvailable());
    shop.setDeliveryFee(request.getDeliveryFee());

    return map(shopRepository.save(shop));
}

}
