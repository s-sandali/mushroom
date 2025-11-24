package com.fungiflow.fungiflow.service;

import com.fungiflow.fungiflow.dto.AllocationDTO;
import com.fungiflow.fungiflow.dto.DailyUpdateDTO;
import com.fungiflow.fungiflow.model.Allocation;
import com.fungiflow.fungiflow.model.DailyUpdate;
import com.fungiflow.fungiflow.model.Seed;
import com.fungiflow.fungiflow.repo.AllocationRepository;
import com.fungiflow.fungiflow.repo.DailyUpdateRepository;
import com.fungiflow.fungiflow.repo.SeedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class LabManagementService {

    @Autowired
    private SeedRepository seedRepository;

    @Autowired
    private DailyUpdateRepository dailyUpdateRepository;

    @Autowired
    private AllocationRepository allocationRepository;

    @Transactional
    //recording daily update from a mushroom batch
    public void recordDailyUpdate(DailyUpdateDTO dto) {
        Optional<Seed> optionalSeed = seedRepository.findById(dto.getSeedId());
        if (!optionalSeed.isPresent()) {
            throw new RuntimeException("Batch not found for seedId: " + dto.getSeedId());
        }

        Seed seed = optionalSeed.get();
        int remaining = seed.getInitialQuantity() -
                (seed.getSuccessfulGrowth() + seed.getContaminatedCount());

        // New check for zero remaining cultures
        if (remaining <= 0) {
            throw new IllegalArgumentException(
                    "Batch already fully processed. Remaining cultures: " + remaining
            );
        }

        if (dto.getSuccessfulToday() + dto.getContaminatedToday() > remaining) {
            throw new IllegalArgumentException(
                    "Exceeds remaining cultures. Available: " + remaining +
                            ", Requested: " + (dto.getSuccessfulToday() + dto.getContaminatedToday())
            );
        }

        //creating and saving today's daily update
        DailyUpdate update = new DailyUpdate();
        update.setSeed(seed);
        update.setDate(LocalDate.now());
        update.setSuccessfulToday(dto.getSuccessfulToday());
        update.setContaminatedToday(dto.getContaminatedToday());
        update.setContaminationReason(dto.getContaminationReason());

        //updating the total successful and contaminated rates
        seed.setSuccessfulGrowth(seed.getSuccessfulGrowth() + dto.getSuccessfulToday());
        seed.setContaminatedCount(seed.getContaminatedCount() + dto.getContaminatedToday());

        dailyUpdateRepository.save(update);
        seedRepository.save(seed);
    }

    @Transactional
    //handles the allocation of succesful cultures to sales and production
    public void allocateCultures(AllocationDTO dto) {

        // //throwing exception when the seed batch id is not found
        Optional<Seed> optionalSeed = seedRepository.findById(dto.getSeedId());
        if (!optionalSeed.isPresent()) {
            throw new RuntimeException("Batch not found");
        }

        Seed seed = optionalSeed.get();

        //get the total allocation amount make sure it doesn't exceed the grown batches
        int totalAllocation = dto.getSalesCenterQty() + dto.getProductionQty();
        if (totalAllocation > seed.getSuccessfulGrowth()) {
            throw new IllegalArgumentException("Allocation exceeds successful cultures");
        }

        //f allocation already exists for this batch, update it If not, we make a new one.
        Optional<Allocation> optionalAllocation = allocationRepository.findBySeedId(seed.getId());
        Allocation allocation;

        if (optionalAllocation.isPresent()) {
            allocation = optionalAllocation.get();
        } else {
            allocation = new Allocation();
        }

        //store allocation data in dbs
        allocation.setSeed(seed);
        allocation.setSalesCenterQty(dto.getSalesCenterQty());
        allocation.setProductionQty(dto.getProductionQty());

        allocationRepository.save(allocation);
    }
    public List<Allocation> getAllAllocations() {
        return allocationRepository.findAll();
    }
}
