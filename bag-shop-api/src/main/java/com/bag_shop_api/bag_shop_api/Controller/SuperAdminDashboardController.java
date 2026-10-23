package com.bag_shop_api.bag_shop_api.Controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bag_shop_api.bag_shop_api.DTO.SuperAdminDashboardResponse;
import com.bag_shop_api.bag_shop_api.Service.SuperAdminDashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/super-admin/dashboard")
@RequiredArgsConstructor
public class SuperAdminDashboardController {

    private final SuperAdminDashboardService dashboardService;

    @GetMapping
    public ResponseEntity<SuperAdminDashboardResponse> getDashboard() {

        return ResponseEntity.ok(
                dashboardService.getDashboard()
        );
    }
}
