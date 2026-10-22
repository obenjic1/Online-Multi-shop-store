package com.bag_shop_api.bag_shop_api.Service;

import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.bag_shop_api.bag_shop_api.DTO.ShopRequest;
import com.bag_shop_api.bag_shop_api.DTO.ShopResponse;
import com.bag_shop_api.bag_shop_api.Entity.Shop;
import com.bag_shop_api.bag_shop_api.Entity.User;
import com.bag_shop_api.bag_shop_api.Enums.Role;
import com.bag_shop_api.bag_shop_api.Repository.ShopRepository;
import com.bag_shop_api.bag_shop_api.Repository.UserRepository;
import java.util.List;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ShopService {

private final ShopRepository shopRepository;
private final UserRepository userRepository;
private final CurrentUserService currentUserService;
private final ImageStorageService imageStorageService;

   public ShopResponse create(
        ShopRequest request,
        MultipartFile logoFile,
        MultipartFile bannerFile
) throws IOException {

    User owner = userRepository.findById(request.getOwnerId())
            .orElseThrow(() ->
                    new RuntimeException("Administrator not found"));

    if (owner.getRole() != Role.ROLE_ADMIN) {
        throw new RuntimeException(
                "Only users with ADMIN role can own a shop");
    }

    if (shopRepository.existsByOwnerId(owner.getId())) {
        throw new RuntimeException(
                "This administrator already owns a shop");
    }

    String slug = generateUniqueSlug(request.getName());

    String logoUrl = null;
    String bannerUrl = null;

    if (logoFile != null && !logoFile.isEmpty()) {
        logoUrl = imageStorageService.upload(
                logoFile,
                "shops/logos"
        );
    }

    if (bannerFile != null && !bannerFile.isEmpty()) {
        bannerUrl = imageStorageService.upload(
                bannerFile,
                "shops/banners"
        );
    }

    Shop shop = Shop.builder()
            .name(request.getName())
            .slug(slug)
            .description(request.getDescription())

            .logo(logoUrl)
            .banner(bannerUrl)

            .themeColor(request.getThemeColor())
            .accentColor(request.getAccentColor())

            .phoneNumber(request.getPhoneNumber())
            .whatsappNumber(request.getWhatsappNumber())
            .email(request.getEmail())

            .address(request.getAddress())
            .city(request.getCity())
            .region(request.getRegion())
            .landmark(request.getLandmark())

            .pickupAvailable(request.isPickupAvailable())
            .deliveryAvailable(request.isDeliveryAvailable())
            .deliveryFee(request.getDeliveryFee())

            .active(true)
            .owner(owner)

            .build();

    return map(shopRepository.save(shop));
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
    
    public ShopResponse updateMyShop(
            ShopRequest request,
            MultipartFile logoFile,
            MultipartFile bannerFile) throws IOException {
    User owner = currentUserService.getCurrentUser();

    Shop shop = shopRepository.findByOwnerId(owner.getId())
            .orElseThrow(() ->
                    new RuntimeException("You do not have a shop"));

    shop.setName(request.getName());
    shop.setDescription(request.getDescription());
    
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
    if (logoFile != null && !logoFile.isEmpty()) {

        if (shop.getLogo() != null && !shop.getLogo().isBlank()) {
            imageStorageService.delete(shop.getLogo());
        }

        String logoUrl = imageStorageService.upload(
                logoFile,
                "shops/logos"
        );

        shop.setLogo(logoUrl);
    }


    if (bannerFile != null && !bannerFile.isEmpty()) {

        if (shop.getBanner() != null && !shop.getBanner().isBlank()) {
            imageStorageService.delete(shop.getBanner());
        }

        String bannerUrl = imageStorageService.upload(
                bannerFile,
                "shops/banners"
        );

        shop.setBanner(bannerUrl);
    }

    return map(shopRepository.save(shop));
}
public ShopResponse assignAdmin(Long shopId, Long adminId) {

    // Find the shop
    Shop shop = shopRepository.findById(shopId)
            .orElseThrow(() ->
                    new RuntimeException("Shop not found"));

    // Find the user
    // Find the administrator
    User admin = userRepository.findById(adminId)
            .orElseThrow(() ->
                    new RuntimeException("Administrator not found"));

    // Make sure the selected user is actually an ADMIN
    if (admin.getRole() != Role.ROLE_ADMIN) {
        throw new RuntimeException(
                "Only users with ADMIN role can own a shop");
    }

    // Make sure this administrator does not already own another shop
    shopRepository.findByOwnerId(admin.getId())
            .ifPresent(existingShop -> {

                if (!existingShop.getId().equals(shop.getId())) {
                    throw new RuntimeException(
                            "This administrator already owns another shop");
                }
            });

    // Assign administrator to shop
    shop.setOwner(admin);

    return map(shopRepository.save(shop));
}

public List<ShopResponse> findAll() {

    return shopRepository.findAllByOrderByNameAsc()
            .stream()
            .map(this::map)
            .toList();
}

public ShopResponse getShopById(Long shopId) {

    Shop shop = shopRepository.findById(shopId)
            .orElseThrow(() ->
                    new RuntimeException("Shop not found")
            );

    return map(shop);
}

public ShopResponse updateShop(
        Long shopId,
        ShopRequest request,
        MultipartFile logoFile,
        MultipartFile bannerFile
) throws IOException {

    Shop shop = shopRepository.findById(shopId)
            .orElseThrow(() ->
                    new RuntimeException("Shop not found"));

    // =========================================================
    // STORE INFORMATION
    // =========================================================

    shop.setName(request.getName());
    shop.setDescription(request.getDescription());

    // =========================================================
    // BRANDING
    // =========================================================

    shop.setThemeColor(request.getThemeColor());
    shop.setAccentColor(request.getAccentColor());

    // =========================================================
    // CONTACT
    // =========================================================

    shop.setPhoneNumber(request.getPhoneNumber());
    shop.setWhatsappNumber(request.getWhatsappNumber());
    shop.setEmail(request.getEmail());

    // =========================================================
    // LOCATION
    // =========================================================

    shop.setAddress(request.getAddress());
    shop.setCity(request.getCity());
    shop.setRegion(request.getRegion());
    shop.setLandmark(request.getLandmark());

    // =========================================================
    // ORDER OPTIONS
    // =========================================================

    shop.setPickupAvailable(request.isPickupAvailable());
    shop.setDeliveryAvailable(request.isDeliveryAvailable());
    shop.setDeliveryFee(request.getDeliveryFee());

    // =========================================================
    // LOGO
    // =========================================================

    if (logoFile != null && !logoFile.isEmpty()) {

        if (shop.getLogo() != null &&
                !shop.getLogo().isBlank()) {

            imageStorageService.delete(shop.getLogo());
        }

        String logoUrl = imageStorageService.upload(
                logoFile,
                "shops/logos"
        );

        shop.setLogo(logoUrl);
    }

    // =========================================================
    // BANNER
    // =========================================================

    if (bannerFile != null && !bannerFile.isEmpty()) {

        if (shop.getBanner() != null &&
                !shop.getBanner().isBlank()) {

            imageStorageService.delete(shop.getBanner());
        }

        String bannerUrl = imageStorageService.upload(
                bannerFile,
                "shops/banners"
        );

        shop.setBanner(bannerUrl);
    }

    return map(shopRepository.save(shop));
}
}
