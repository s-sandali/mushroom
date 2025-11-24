package com.fungiflow.fungiflow.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fungiflow.fungiflow.dto.PreAllocationDto;
import com.fungiflow.fungiflow.service.PreAllocationService;

import lombok.AllArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@AllArgsConstructor
@RestController
@RequestMapping("/api/preorderAllocation")
public class PreAllocationController {

    private final PreAllocationService preallocationService;

    // Create Allocation
    @PostMapping
    public ResponseEntity<PreAllocationDto> createPreAllocation(@RequestBody PreAllocationDto allocationDto) {
        Long branchId = allocationDto.getBranchId();
        if (branchId == null) {
            return ResponseEntity.badRequest().body(null);
        }
        PreAllocationDto savedPreAllocation = preallocationService.createPreAllocation(branchId, allocationDto);
        return new ResponseEntity<>(savedPreAllocation, HttpStatus.CREATED);
    }

    // Get Allocation by ID
    @GetMapping("/{id}")
    public ResponseEntity<PreAllocationDto> getPreAllocationById(@PathVariable Long id) {
        PreAllocationDto preallocationDto = preallocationService.getPreAllocationById(id);
        return ResponseEntity.ok(preallocationDto);
    }

    // Get all Allocations
    @GetMapping
    public ResponseEntity<List<PreAllocationDto>> getAllPreAllocations() {
        List<PreAllocationDto> preallocations = preallocationService.getAllPreAllocations();
        return ResponseEntity.ok(preallocations);
    }

    // Update Allocation
    @PutMapping("/{id}")
    public ResponseEntity<PreAllocationDto> updatePreAllocation(@PathVariable Long id, @RequestBody PreAllocationDto preallocationDto) {
        PreAllocationDto updatedPreAllocation = preallocationService.updatePreAllocation(id, preallocationDto);
        return ResponseEntity.ok(updatedPreAllocation);
    }

    // Delete Allocation
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePreAllocation(@PathVariable Long id) {
        preallocationService.deletePreAllocation(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    // Allocate Products to Branch
    @PostMapping("/allocate")
    public ResponseEntity<Void> allocateProductsToBranch(@RequestParam Long branchId, @RequestParam Long productId, @RequestParam int quantity) {
        preallocationService.allocateProductsToBranch(branchId, productId, quantity);
        return ResponseEntity.ok().build();
    }
}
