package com.fungiflow.fungiflow.controller;


import com.fungiflow.fungiflow.dto.LabChartDTO;
import com.fungiflow.fungiflow.dto.SalesChartDTO;
import com.fungiflow.fungiflow.model.Seed;
import com.fungiflow.fungiflow.model.Stock;
import com.fungiflow.fungiflow.service.AdminDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/admin")
public class AdminDashboardController {

    @Autowired
    private AdminDashboardService adminDashboardService;

    // Returns sales chart grouped by customer and month
    @GetMapping("/sales-chart-grouped")
    public List<SalesChartDTO> getGroupedSalesChart() {
        return adminDashboardService.getSalesChartGroupedData();
    }

    @GetMapping("/low-stock-alerts")
    public List<Stock> getLowStockAlerts(@RequestParam(defaultValue = "10") int threshold) {
        return adminDashboardService.getLowStockStocks(threshold);
    }

    // Returns overall sales grouped by customer and month
    @GetMapping("/overall-sales")
    public List<SalesChartDTO> getOverallSalesPerformance() {
        return adminDashboardService.getSalesChartGroupedData(); // reuse same logic
    }

    @GetMapping("/lab-chart")
    public ResponseEntity<List<LabChartDTO>> getLabChart(
            @RequestParam int year,
            @RequestParam(required = false) String type) {

        Seed.MushroomType mushroomType = null;
        if (type != null && !type.isEmpty()) {
            try {
                mushroomType = Seed.MushroomType.valueOf(type.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build(); // invalid enum value
            }
        }

        List<LabChartDTO> data = adminDashboardService.getLabChartData(year, mushroomType);
        return ResponseEntity.ok(data);
    }
}
