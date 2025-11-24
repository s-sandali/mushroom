package com.fungiflow.fungiflow.controller;

import com.fungiflow.fungiflow.dto.AllocationDTO;
import com.fungiflow.fungiflow.model.Allocation;
import com.fungiflow.fungiflow.service.LabManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/allocations")
public class AllocationController {

    @Autowired
    private LabManagementService labService;

    @PostMapping
    public ResponseEntity<String> allocateCultures(@RequestBody AllocationDTO dto) {
        labService.allocateCultures(dto);
        return ResponseEntity.ok("Allocation successful");
    }

    @GetMapping
    public List<Allocation> getAllAllocations() {
        return labService.getAllAllocations();
    }
}
