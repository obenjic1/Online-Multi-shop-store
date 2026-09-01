
package com.bag_shop_api.bag_shop_api.Service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bag_shop_api.bag_shop_api.DTO.ProductRequest;
import com.bag_shop_api.bag_shop_api.DTO.ProductResponse;
import com.bag_shop_api.bag_shop_api.Entity.Category;
import com.bag_shop_api.bag_shop_api.Entity.Product;
import com.bag_shop_api.bag_shop_api.Entity.Shop;
import com.bag_shop_api.bag_shop_api.Repository.CategoryRepository;
import com.bag_shop_api.bag_shop_api.Repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

        private final ProductRepository productRepository;
        private final CategoryRepository categoryRepository;
        private final CurrentUserService currentUserService;
        private final ImageStorageService imageStorageService;

        public ProductResponse create(ProductRequest request) {

                // Get the shop belonging to the currently authenticated user
                Shop shop = currentUserService.getCurrentShop();

                // Make sure the category belongs to the current user's shop
                Category category = categoryRepository
                                .findByIdAndShopId(request.getCategoryId(), shop.getId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Category not found in your shop"));

                Product product = new Product();

                product.setName(request.getName());
                product.setDescription(request.getDescription());
                product.setPrice(request.getPrice());
                product.setStockQuantity(request.getStockQuantity());
                product.setCategory(category);
                product.setShop(shop);
                product.setActive(true);

                return map(productRepository.save(product));
        }

        @Transactional(readOnly = true)
        public List<ProductResponse> findAll() {

                Shop shop = currentUserService.getCurrentShop();

                return productRepository
                                .findByShopIdAndActiveTrue(shop.getId())
                                .stream()
                                .map(this::map)
                                .toList();
        }

        @Transactional(readOnly = true)
        public ProductResponse findById(Long id) {

                Shop shop = currentUserService.getCurrentShop();

                Product product = productRepository
                                .findByIdAndShopId(id, shop.getId())
                                .orElseThrow(() -> new RuntimeException("Product not found"));

                return map(product);
        }

        public ProductResponse update(Long id, ProductRequest request) {

                Shop shop = currentUserService.getCurrentShop();

                // Only retrieve products belonging to the current user's shop
                Product product = productRepository
                                .findByIdAndShopId(id, shop.getId())
                                .orElseThrow(() -> new RuntimeException("Product not found"));

                // Only allow categories belonging to the current user's shop
                Category category = categoryRepository
                                .findByIdAndShopId(request.getCategoryId(), shop.getId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Category not found in your shop"));

                product.setName(request.getName());
                product.setDescription(request.getDescription());
                product.setPrice(request.getPrice());
                product.setStockQuantity(request.getStockQuantity());
                product.setCategory(category);
                

                return map(productRepository.save(product));
        }

        public void delete(Long id) {

                Shop shop = currentUserService.getCurrentShop();

                Product product = productRepository
                                .findByIdAndShopId(id, shop.getId())
                                .orElseThrow(() -> new RuntimeException("Product not found"));

                product.setActive(false);
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
