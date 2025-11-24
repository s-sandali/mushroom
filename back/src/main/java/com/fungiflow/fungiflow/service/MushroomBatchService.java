package com.fungiflow.fungiflow.service;

import com.fungiflow.fungiflow.dto.ContaminationStatDTO;
import com.fungiflow.fungiflow.dto.SeedCreationDTO;
import com.fungiflow.fungiflow.model.Seed;
import com.fungiflow.fungiflow.repo.InventoryRepository;
import com.fungiflow.fungiflow.repo.SeedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MushroomBatchService {

    @Autowired
    private SeedRepository seedRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    // Create a new seed batch
    @Transactional
    public Seed createSeedBatch(SeedCreationDTO dto) {
        Seed seed = new Seed();
        seed.setCultivationStartDate(LocalDate.now());
        seed.setType(dto.getType());
        seed.setInitialQuantity(dto.getInitialQuantity());
        seed.setCultivationComplete(false);
        return seedRepository.save(seed);
    }


    // Auto contaminate stale batches (more than 3 days without update and incomplete)
    @Transactional
    public void autoRemoveContaminated() {
        List<Seed> incompleteBatches = seedRepository.findByCultivationCompleteFalse();
        for (int i = 0; i < incompleteBatches.size(); i++) {
            Seed seed = incompleteBatches.get(i);
            LocalDate lastUpdate = seed.getCultivationEndDate();
            if (lastUpdate == null && seed.getCultivationStartDate().isBefore(LocalDate.now().minusDays(3))) {
                int pending = seed.getInitialQuantity() - seed.getSuccessfulGrowth() - seed.getContaminatedCount();
                seed.setContaminatedCount(seed.getContaminatedCount() + pending);
                seed.setCultivationComplete(true);
                seed.setCultivationEndDate(LocalDate.now());
                seedRepository.save(seed);
            }
        }
    }

    // Check if a batch has over 50% contamination and flag it
    @Transactional
    public void checkContaminationThreshold(Seed seed) {
        int total = seed.getInitialQuantity();
        if (total == 0) return;

        int contaminated = seed.getContaminatedCount();
        double ratio = (double) contaminated / total;

        if (ratio > 0.5) {
            seed.setCultivationComplete(true);
            seed.setCultivationEndDate(LocalDate.now());
            seedRepository.save(seed);
        }
    }

    // Calculate contamination statistics per mushroom type
    public List<ContaminationStatDTO> getContaminationStatsPerType() {
        List<Seed> allSeeds = seedRepository.findAll();
        Map<Seed.MushroomType, List<Seed>> groupedByType = new HashMap<>();

        for (int i = 0; i < allSeeds.size(); i++) {
            Seed seed = allSeeds.get(i);
            Seed.MushroomType type = seed.getType();

            if (!groupedByType.containsKey(type)) {
                groupedByType.put(type, new ArrayList<>());
            }
            groupedByType.get(type).add(seed);
        }

        List<ContaminationStatDTO> stats = new ArrayList<>();
        for (Map.Entry<Seed.MushroomType, List<Seed>> entry : groupedByType.entrySet()) {
            Seed.MushroomType type = entry.getKey();
            List<Seed> seeds = entry.getValue();

            int totalBatches = seeds.size();
            int totalContaminated = 0;

            for (int i = 0; i < seeds.size(); i++) {
                Seed seed = seeds.get(i);
                int initialQty = seed.getInitialQuantity();
                if (initialQty > 0) {
                    totalContaminated += seed.getContaminatedCount();
                }
            }

            int totalInitial = 0;
            for (int i = 0; i < seeds.size(); i++) {
                totalInitial += seeds.get(i).getInitialQuantity();
            }

            double contaminationRate = (totalInitial == 0) ? 0 : ((double) totalContaminated / totalInitial) * 100.0;
            stats.add(new ContaminationStatDTO(type, totalBatches, totalContaminated, contaminationRate));
        }

        return stats;
    }
}
