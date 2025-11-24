package com.fungiflow.fungiflow.service;

import com.fungiflow.fungiflow.model.Seed;
import com.fungiflow.fungiflow.repo.SeedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class CultivationService {

    @Autowired
    private SeedRepository seedRepository;

    @Scheduled(cron = "0 0 0 * * *")
    public void checkCultivationProgress() {
        List<Seed> activeBatches = seedRepository.findByCultivationCompleteFalse();
        for (Seed batch : activeBatches) {
            int daysgrown = daysSince(batch.getCultivationStartDate());


            if (daysgrown >= batch.getType().growthDays) {
                calculateFinal(batch);
            }
        }

    }
    private int daysSince(LocalDate date) {
        return (int) ChronoUnit.DAYS.between(date, LocalDate.now());
    }


    private void calculateFinal(Seed batch) {
        int remaining = batch.getInitialQuantity() -
                (batch.getSuccessfulGrowth() + batch.getContaminatedCount());
        batch.setContaminatedCount(batch.getContaminatedCount() + remaining);
        batch.setCultivationComplete(true);
        seedRepository.save(batch);
    }
}
