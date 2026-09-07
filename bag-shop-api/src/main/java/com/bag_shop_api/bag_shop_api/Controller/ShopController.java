package com.bag_shop_api.bag_shop_api.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bag_shop_api.bag_shop_api.DTO.ShopRequest;
import com.bag_shop_api.bag_shop_api.DTO.ShopResponse;
import com.bag_shop_api.bag_shop_api.Service.ShopService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/shops")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    @PostMapping
    public ResponseEntity<ShopResponse> create(
            @Valid @RequestBody ShopRequest request) {

        return ResponseEntity.ok(
                shopService.create(request));
    }
    
    @GetMapping("/me")
public ResponseEntity<ShopResponse> getMyShop() {
    return ResponseEntity.ok(shopService.getMyShop());
}

@PutMapping("/me")
public ResponseEntity<ShopResponse> updateMyShop(
        @Valid @RequestBody ShopRequest request) {

    return ResponseEntity.ok(
            shopService.updateMyShop(request));
}
}
