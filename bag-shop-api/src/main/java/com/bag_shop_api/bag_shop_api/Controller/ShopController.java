package com.bag_shop_api.bag_shop_api.Controller;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import java.util.List;

import com.bag_shop_api.bag_shop_api.DTO.ShopRequest;
import com.bag_shop_api.bag_shop_api.DTO.ShopResponse;
import com.bag_shop_api.bag_shop_api.Service.ShopService;
import org.springframework.web.bind.annotation.PathVariable;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/shops")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    @PostMapping(
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
)
public ResponseEntity<ShopResponse> create(
        @Valid @RequestPart("shop") ShopRequest request,

        @RequestPart(value = "logoFile", required = false)
        MultipartFile logoFile,

        @RequestPart(value = "bannerFile", required = false)
        MultipartFile bannerFile
) throws IOException {

    return ResponseEntity.ok(
            shopService.create(
                    request,
                    logoFile,
                    bannerFile
            )
    );
}
    
    @GetMapping("/me")
public ResponseEntity<ShopResponse> getMyShop() {
    return ResponseEntity.ok(shopService.getMyShop());
}

    @PutMapping(
            value = "/me",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ShopResponse> updateMyShop(

            @Valid @RequestPart("shop")
            ShopRequest request,

            @RequestPart(
                    value = "logoFile",
                    required = false
            )
            MultipartFile logoFile,

            @RequestPart(
                    value = "bannerFile",
                    required = false
            )
            MultipartFile bannerFile

    ) throws IOException {

        return ResponseEntity.ok(
                shopService.updateMyShop(
                        request,
                        logoFile,
                        bannerFile
                )
        );
    }
    @PutMapping(
        value = "/{shopId}",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
)
public ResponseEntity<ShopResponse> updateShop(
        @PathVariable Long shopId,

        @Valid @RequestPart("shop")
        ShopRequest request,

        @RequestPart(
                value = "logoFile",
                required = false
        )
        MultipartFile logoFile,

        @RequestPart(
                value = "bannerFile",
                required = false
        )
        MultipartFile bannerFile

) throws IOException {

    return ResponseEntity.ok(
            shopService.updateShop(
                    shopId,
                    request,
                    logoFile,
                    bannerFile
            )
    );
}
    @PutMapping("/{shopId}/owner/{adminId}")
public ResponseEntity<ShopResponse> assignAdmin(
        @PathVariable Long shopId,
        @PathVariable Long adminId) {

    return ResponseEntity.ok(
            shopService.assignAdmin(shopId, adminId)
    );
}

@GetMapping
public ResponseEntity<List<ShopResponse>> findAll() {

    return ResponseEntity.ok(
            shopService.findAll()
    );
}
@GetMapping("/{shopId}")
public ResponseEntity<ShopResponse> getShopById(
        @PathVariable Long shopId) {

    return ResponseEntity.ok(
            shopService.getShopById(shopId)
    );
}
}
