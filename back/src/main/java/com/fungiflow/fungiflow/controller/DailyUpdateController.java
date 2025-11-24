package com.fungiflow.fungiflow.controller;

import com.fungiflow.fungiflow.dto.DailyUpdateDTO;
import com.fungiflow.fungiflow.service.LabManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/daily-updates")
public class DailyUpdateController {

    @Autowired
    private LabManagementService labService;

    @PostMapping
    public ResponseEntity<?> recordDailyUpdate(@RequestBody DailyUpdateDTO dto) {
        try {
            labService.recordDailyUpdate(dto);
            return ResponseEntity.ok().body("Daily update recorded successfully");
        } catch (RuntimeException e) {
            // Handle batch not found or other runtime exceptions
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("An unexpected error occurred: " + e.getMessage());
        }
    }
}
