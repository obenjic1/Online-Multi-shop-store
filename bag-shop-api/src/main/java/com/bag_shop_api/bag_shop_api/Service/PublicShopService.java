package com.bag_shop_api.bag_shop_api.Service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bag_shop_api.bag_shop_api.DTO.ProductResponse;
import com.bag_shop_api.bag_shop_api.DTO.PublicCategoryResponse;
import com.bag_shop_api.bag_shop_api.DTO.PublicShopPageResponse;
import com.bag_shop_api.bag_shop_api.DTO.PublicShopResponse;
import com.bag_shop_api.bag_shop_api.Entity.Category;
import com.bag_shop_api.bag_shop_api.Entity.Product;
import com.bag_shop_api.bag_shop_api.Entity.Shop;
import com.bag_shop_api.bag_shop_api.Repository.CategoryRepository;
import com.bag_shop_api.bag_shop_api.Repository.ProductRepository;
import com.bag_shop_api.bag_shop_api.Repository.ShopRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PublicShopService {

    private final ShopRepository shopRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;



    public List<PublicShopResponse> findAll() {

        return shopRepository
                .findByActiveTrue()
                .stream()
                .map(this::mapShop)
                .toList();
    }



    public PublicShopResponse findBySlug(String slug) {

        Shop shop = getActiveShop(slug);

        return mapShop(shop);
    }


    public PublicShopPageResponse getShopPage(String slug) {

        Shop shop = getActiveShop(slug);



        List<PublicCategoryResponse> categories =
                categoryRepository
                        .findByShopId(shop.getId())
                        .stream()
                        .map(this::mapCategory)
                        .toList();



        List<ProductResponse> products =
                productRepository
                        .findByShopIdAndActiveTrue(shop.getId())
                        .stream()
                        .map(this::mapProduct)
                        .toList();



        return PublicShopPageResponse.builder()
                .shop(mapShop(shop))
                .categories(categories)
                .products(products)
                .build();
    }


    private Shop getActiveShop(String slug) {

        return shopRepository
                .findBySlugAndActiveTrue(slug)
                .orElseThrow(() ->
                        new RuntimeException("Shop not found"));
    }



    private PublicShopResponse mapShop(Shop shop) {

        return PublicShopResponse.builder()

                .id(shop.getId())

                .name(shop.getName())

                .slug(shop.getSlug())

                .description(shop.getDescription())

                .logo(shop.getLogo())


                .themeColor(shop.getThemeColor())


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

                .latitude(
                        shop.getLatitude())

                .longitude(
                        shop.getLongitude())


                .pickupAvailable(
                        shop.isPickupAvailable())

                .deliveryAvailable(
                        shop.isDeliveryAvailable())



                .active(
                        shop.isActive())

                .build();
    }

    private PublicCategoryResponse mapCategory(
            Category category) {

        Shop shop = category.getShop();

        return PublicCategoryResponse.builder()

                .id(category.getId())

                .name(category.getName())

                .shopId(shop.getId())

                .shopName(shop.getName())

                .shopSlug(shop.getSlug())

                .build();
    }


   

    private ProductResponse mapProduct(
            Product product) {

        return ProductResponse.builder()

                .id(product.getId())

                .name(product.getName())

                .description(product.getDescription())

                .price(product.getPrice())

                .stockQuantity(
                        product.getStockQuantity())

                .active(
                        product.isActive())

                .categoryId(
                        product.getCategory().getId())

                .categoryName(
                        product.getCategory().getName())

                .images(
                        product.getImages()
                                .stream()
                                .map(image ->
                                        image.getImageUrl())
                                .toList())

                .build();
    }
}