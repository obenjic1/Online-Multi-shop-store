package com.bag_shop_api.bag_shop_api.Service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.bag_shop_api.bag_shop_api.DTO.ProductImageResponse;
import com.bag_shop_api.bag_shop_api.Entity.Product;
import com.bag_shop_api.bag_shop_api.Entity.ProductImage;
import com.bag_shop_api.bag_shop_api.Entity.Shop;
import com.bag_shop_api.bag_shop_api.Repository.ProductImageRepository;
import com.bag_shop_api.bag_shop_api.Repository.ProductRepository;
//import com.cloudinary.Cloudinary;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductImageService {

        private final ProductRepository productRepository;
        private final ProductImageRepository productImageRepository;
     //   private final Cloudinary cloudinary;
        private final ImageStorageService imageStorageService;
        private final CurrentUserService currentUserService;
                
        
        @Transactional
        public void upload(
                Long productId,
                List<MultipartFile> files) throws IOException {

            // Get the currently authenticated user's shop
            Shop shop = currentUserService.getCurrentShop();

            // Only find the product if it belongs to the current user's shop
            Product product = productRepository
                    .findByIdAndShopId(productId, shop.getId())
                    .orElseThrow(() ->
                            new RuntimeException("Product not found"));

            long currentImageCount =
                    productImageRepository.countByProductId(productId);

            for (MultipartFile file : files) {
            	/*

                Map<?, ?> result = cloudinary.uploader().upload(
                        file.getBytes(),
                        ObjectUtils.asMap(
                                "folder", "bag-shop/products")); 
                                
                                
                                     String imageUrl = (String) result.get("secure_url");
           
                                
                                */
            	

                String imageUrl = imageStorageService.upload(
                        file,
                        "products");



                ProductImage image = new ProductImage();

                image.setProduct(product);
                image.setImageUrl(imageUrl);
                image.setOriginalFileName(file.getOriginalFilename());
                image.setPrimaryImage(currentImageCount == 0);
                image.setDisplayOrder((int) currentImageCount);

                productImageRepository.save(image);

                currentImageCount++;
            }
        }

        @Transactional(readOnly = true)
        public List<ProductImageResponse> getByProductId(Long productId) {

            Shop shop = currentUserService.getCurrentShop();

            // Verify that the product belongs to the current user's shop
            Product product = productRepository
                    .findByIdAndShopId(productId, shop.getId())
                    .orElseThrow(() ->
                            new RuntimeException("Product not found"));

            return productImageRepository
                    .findByProductIdOrderByDisplayOrderAsc(product.getId())
                    .stream()
                    .map(image -> new ProductImageResponse(
                            image.getId(),
                            image.getImageUrl(),
                            image.getOriginalFileName(),
                            image.isPrimaryImage(),
                            image.getDisplayOrder()))
                    .toList();
        }
        
        /*

        @Transactional
        public void delete(Long productId, Long imageId) {

            Shop shop = currentUserService.getCurrentShop();

            // First verify that the product belongs to the current user's shop
            Product product = productRepository
                    .findByIdAndShopId(productId, shop.getId())
                    .orElseThrow(() ->
                            new RuntimeException("Product not found"));

            ProductImage image = productImageRepository
                    .findById(imageId)
                    .orElseThrow(() ->
                            new RuntimeException("Image not found: " + imageId));

            // Make sure the image belongs to the requested product
            if (!image.getProduct().getId().equals(product.getId())) {

                throw new RuntimeException(
                        "Image does not belong to this product");
            }

            boolean wasPrimary = image.isPrimaryImage();

            productImageRepository.delete(image);

            // If the deleted image was primary,
            // make the first remaining image primary.
            if (wasPrimary) {

                productImageRepository
                        .findFirstByProductIdOrderByDisplayOrderAsc(productId)
                        .ifPresent(nextImage -> {

                            nextImage.setPrimaryImage(true);

                            productImageRepository.save(nextImage);
                        });
            }
        } */
        
        @Transactional
        public void delete(Long productId, Long imageId) {

            Shop shop = currentUserService.getCurrentShop();

            Product product = productRepository
                    .findByIdAndShopId(productId, shop.getId())
                    .orElseThrow(() ->
                            new RuntimeException("Product not found"));

            ProductImage image = productImageRepository
                    .findById(imageId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Image not found: " + imageId));

            if (!image.getProduct().getId().equals(product.getId())) {

                throw new RuntimeException(
                        "Image does not belong to this product");
            }

            boolean wasPrimary = image.isPrimaryImage();

            try {

                imageStorageService.delete(
                        image.getImageUrl());

            } catch (IOException e) {

                throw new RuntimeException(
                        "Failed to delete image file", e);
            }

            productImageRepository.delete(image);

            if (wasPrimary) {

                productImageRepository
                        .findFirstByProductIdOrderByDisplayOrderAsc(productId)
                        .ifPresent(nextImage -> {

                            nextImage.setPrimaryImage(true);

                            productImageRepository.save(nextImage);
                        });
            }
        }
        

}
