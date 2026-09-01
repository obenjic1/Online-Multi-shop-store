package com.bag_shop_api.bag_shop_api.Service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bag_shop_api.bag_shop_api.DTO.ProductResponse;
import com.bag_shop_api.bag_shop_api.Entity.Product;
import com.bag_shop_api.bag_shop_api.Entity.Shop;
import com.bag_shop_api.bag_shop_api.Repository.ProductRepository;
import com.bag_shop_api.bag_shop_api.Repository.ShopRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PublicProductService {

    private final ProductRepository productRepository;
    private final ShopRepository shopRepository;

  
    public List<ProductResponse> findAll() {

        return productRepository.findByActiveTrue()
                .stream()
                .filter(product -> product.getShop().isActive())
                .map(this::map)
                .toList();
    }

  
    public List<ProductResponse> findByShopSlug(String slug) {

        Shop shop = shopRepository.findBySlug(slug)
                .orElseThrow(() ->
                        new RuntimeException("Shop not found"));

        if (!shop.isActive()) {
            throw new RuntimeException("Shop is not active");
        }

        return productRepository
                .findByShopIdAndActiveTrue(shop.getId())
                .stream()
                .map(this::map)
                .toList();
    }

   
    public ProductResponse findById(Long id) {

        Product product = productRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        if (!product.isActive()) {
            throw new RuntimeException("Product not found");
        }

        if (!product.getShop().isActive()) {
            throw new RuntimeException("Product not found");
        }

        return map(product);
    }

  
    public ProductResponse findByShopSlugAndProductId(
            String slug,
            Long productId) {

        Shop shop = shopRepository.findBySlug(slug)
                .orElseThrow(() ->
                        new RuntimeException("Shop not found"));

        if (!shop.isActive()) {
            throw new RuntimeException("Shop is not active");
        }

        Product product = productRepository
                .findByIdAndShopId(productId, shop.getId())
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        if (!product.isActive()) {
            throw new RuntimeException("Product not found");
        }

        return map(product);
    }

    private ProductResponse map(Product product) {

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .active(product.isActive())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .shopId(product.getShop().getId())
            .shopName(product.getShop().getName())
            .shopSlug(product.getShop().getSlug())

                .images(
                        product.getImages()
                                .stream()
                                .map(image -> image.getImageUrl())
                                .toList())
                .build();
    }
}
