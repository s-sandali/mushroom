package com.fungiflow.fungiflow.controller;

import com.fungiflow.fungiflow.dto.MaterialRequestDTO;
import com.fungiflow.fungiflow.model.InventoryItem;
import com.fungiflow.fungiflow.model.MaterialRequest;
import com.fungiflow.fungiflow.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public List<InventoryItem> getAllItems() {
        return inventoryService.getAllItems();
    }

    @GetMapping("/{id}")
    public InventoryItem getItemById(@PathVariable Long id) {
        return inventoryService.getItemById(id);
    }

    @PostMapping
    public InventoryItem addItem(@RequestBody InventoryItem item) {
        return inventoryService.addItem(item);
    }

    // Updated: Accepts MaterialRequestDTO and returns the created MaterialRequest
    @PostMapping("/material-requests")
    public ResponseEntity<MaterialRequest> createMaterialRequest(@RequestBody MaterialRequestDTO requestDTO) {
        MaterialRequest created = inventoryService.createMaterialRequest(requestDTO);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public InventoryItem updateItem(@PathVariable Long id, @RequestBody InventoryItem updated) {
        return inventoryService.updateItem(id, updated);
    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        inventoryService.deleteItem(id);
    }

    @GetMapping("/low-stock")
    public List<InventoryItem> getLowStockItems() {
        return inventoryService.getLowStockItems();
    }

    // (Optional) Get all material requests, if you want to display them
    @GetMapping("/material-requests")
    public List<MaterialRequest> getAllMaterialRequests() {
        return inventoryService.getAllMaterialRequests();
    }


}
