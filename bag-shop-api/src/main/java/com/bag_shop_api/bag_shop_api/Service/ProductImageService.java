package com.bag_shop_api.bag_shop_api.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.bag_shop_api.bag_shop_api.DTO.ProductImageResponse;
import com.bag_shop_api.bag_shop_api.Entity.Product;
import com.bag_shop_api.bag_shop_api.Entity.ProductImage;
import com.bag_shop_api.bag_shop_api.Repository.ProductImageRepository;
import com.bag_shop_api.bag_shop_api.Repository.ProductRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductImageService {

        private final ProductRepository productRepository;
        private final ProductImageRepository productImageRepository;
        private final Cloudinary cloudinary;

        @Transactional
        public void upload(
                        Long productId,
                        List<MultipartFile> files) throws IOException {

                Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

                long currentImageCount = productImageRepository.countByProductId(productId);

                for (MultipartFile file : files) {

                        Map<?, ?> result = cloudinary.uploader().upload(
                                        file.getBytes(),
                                        ObjectUtils.asMap(
                                                        "folder", "bag-shop/products"));

                        String imageUrl = (String) result.get("secure_url");

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

                return productImageRepository
                                .findByProductIdOrderByDisplayOrderAsc(productId)
                                .stream()
                                .map(image -> new ProductImageResponse(
                                                image.getId(),
                                                image.getImageUrl(),
                                                image.getOriginalFileName(),
                                                image.isPrimaryImage(),
                                                image.getDisplayOrder()))
                                .toList();
        }
        
     @Transactional
public void delete(Long productId, Long imageId) {

    ProductImage image = productImageRepository
            .findById(imageId)
            .orElseThrow(() ->
                    new RuntimeException("Image not found: " + imageId));

    if (!image.getProduct().getId().equals(productId)) {
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
}

}
