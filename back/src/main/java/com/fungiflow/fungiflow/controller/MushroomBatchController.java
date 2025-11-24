package com.fungiflow.fungiflow.controller;

import com.fungiflow.fungiflow.dto.ContaminationStatDTO;
import com.fungiflow.fungiflow.dto.SeedCreationDTO;
import com.fungiflow.fungiflow.model.Seed;
import com.fungiflow.fungiflow.service.MushroomBatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/batches")
public class MushroomBatchController {

    @Autowired
    private MushroomBatchService batchService;

    // Create seed batch
    @PostMapping("/create")
    public ResponseEntity<?> createBatch(@RequestBody SeedCreationDTO dto) {
        try {
            Seed seed = batchService.createSeedBatch(dto);
            return ResponseEntity.ok(seed);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body("Batch creation failed: " + e.getMessage());
        }
    }


    // Get contamination statistics per type
    @GetMapping("/contamination-stats")
    public List<ContaminationStatDTO> getStats() {
        return batchService.getContaminationStatsPerType();
    }

    // Trigger auto-removal of stale batches (can be a scheduled task too)
    @PostMapping("/auto-remove-contaminated")
    public void autoRemoveContaminated() {
        batchService.autoRemoveContaminated();
    }
}