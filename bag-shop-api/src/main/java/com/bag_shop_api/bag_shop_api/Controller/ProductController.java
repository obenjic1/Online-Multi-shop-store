package com.bag_shop_api.bag_shop_api.Controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.bag_shop_api.bag_shop_api.DTO.ProductImageResponse;
import com.bag_shop_api.bag_shop_api.DTO.ProductRequest;
import com.bag_shop_api.bag_shop_api.DTO.ProductResponse;
import com.bag_shop_api.bag_shop_api.Entity.ProductImage;
import com.bag_shop_api.bag_shop_api.Service.ProductImageService;
import com.bag_shop_api.bag_shop_api.Service.ProductService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ProductImageService productImageService;

    @PostMapping
    public ResponseEntity<ProductResponse> create(
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> findAll() {
        return ResponseEntity.ok(productService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> findById(
            @PathVariable Long id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{productId}/images")
    public ResponseEntity<?> uploadImages(
            @PathVariable Long productId,
            @RequestParam("files") List<MultipartFile> files) throws IOException {

        productImageService.upload(productId, files);

        return ResponseEntity.ok("Images uploaded successfully");
    }

    @GetMapping("/{productId}/images")
    public ResponseEntity<List<ProductImageResponse>> getImages(
            @PathVariable Long productId) {

        return ResponseEntity.ok(
                productImageService.getByProductId(productId));
    }
   @DeleteMapping("/{productId}/images/{imageId}")
public ResponseEntity<Void> deleteImage(
        @PathVariable Long productId,
        @PathVariable Long imageId) {

    productImageService.delete(productId, imageId);

    return ResponseEntity.noContent().build();
}
}
