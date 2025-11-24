package com.fungiflow.fungiflow.service;

import com.fungiflow.fungiflow.dto.LabChartDTO;
import com.fungiflow.fungiflow.dto.SalesChartDTO;
import com.fungiflow.fungiflow.model.Seed;
import com.fungiflow.fungiflow.model.Stock;
import com.fungiflow.fungiflow.repo.DailyUpdateRepository;
import com.fungiflow.fungiflow.repo.SalesRepository;
import com.fungiflow.fungiflow.repo.StockRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminDashboardService {

    @Autowired
    private SalesRepository salesRepository;

    @Autowired
    private DailyUpdateRepository dailyUpdateRepository;

    @Autowired
    private StockRepo stockRepo;

    // --- SALES METHODS (untouched) ---
    public List<SalesChartDTO> getSalesChartGroupedData() {
        List<Object[]> rawData = salesRepository.getMonthlySalesSummary();

        String[] months = {
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
        };

        List<SalesChartDTO> result = new ArrayList<>();

        for (Object[] row : rawData) {
            String productName = (String) row[0];
            int monthNumber = (int) row[1] - 1;
            Long quantity = (Long) row[2];

            SalesChartDTO dto = new SalesChartDTO();
            dto.setProductName(productName);
            dto.setQuantity(quantity.intValue());
            dto.setMonth(months[monthNumber]);

            result.add(dto);
        }

        return result;
    }

    // --- STOCK LOW ALERTS ---
    public List<Stock> getLowStockStocks(int threshold) {
        return stockRepo.findByStockLessThan(threshold);
    }

    // --- LAB PERFORMANCE ---
    public List<LabChartDTO> getLabChartData(int year, Seed.MushroomType type) {
        List<Object[]> rawData = dailyUpdateRepository.getMonthlyLabStats(year, type);

        String[] monthLabels = {
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
        };

        List<LabChartDTO> result = new ArrayList<>();

        for (Object[] row : rawData) {
            int month = (int) row[0];
            long success = row[1] != null ? (long) row[1] : 0;
            long contaminated = row[2] != null ? (long) row[2] : 0;

            String label = monthLabels[month - 1]; // Convert to string label

            result.add(new LabChartDTO(label, success, contaminated));
        }

        return result;
    }
}
