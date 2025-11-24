package com.fungiflow.fungiflow.service;

import com.fungiflow.fungiflow.dto.MaterialRequestDTO;
import com.fungiflow.fungiflow.model.InventoryItem;
import com.fungiflow.fungiflow.model.MaterialRequest;
import com.fungiflow.fungiflow.repo.InventoryRepository;
import com.fungiflow.fungiflow.repo.MaterialRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {
    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private MaterialRequestRepository materialRequestRepository;

    public List<InventoryItem> getAllItems() {
        return inventoryRepository.findAll();
    }

    public InventoryItem getItemById(Long id) {
        return inventoryRepository.findById(id).orElse(null);
    }

    public InventoryItem addItem(InventoryItem item) {
        return inventoryRepository.save(item);
    }

    public InventoryItem updateItem(Long id, InventoryItem updated) {
        InventoryItem item = inventoryRepository.findById(id).orElseThrow();
        item.setQuantity(updated.getQuantity());
        item.setThresholdLevel(updated.getThresholdLevel());
        return inventoryRepository.save(item);
    }

    public void deleteItem(Long id) {
        inventoryRepository.deleteById(id);
    }

    public List<InventoryItem> getLowStockItems() {
        return inventoryRepository.findAll().stream()
                .filter(item -> item.getQuantity() <= item.getThresholdLevel())
                .toList();
    }

    // ---- Material Request Methods ----

    public MaterialRequest createMaterialRequest(MaterialRequestDTO dto) {
        // Fetch the inventory item by ID from the DTO
        InventoryItem item = inventoryRepository.findById(dto.getMaterialId())
                .orElseThrow(() -> new RuntimeException(
                        "Inventory item not found for ID: " + dto.getMaterialId()
                ));

        // Create the request using the item's materialType
        MaterialRequest request = new MaterialRequest();
        request.setMaterialType(item.getMaterialType()); // Get type from InventoryItem
        request.setQuantity(dto.getQuantity());
        request.setRequester(dto.getRequester());
        // requestDate and status will be set by default in the entity
        return materialRequestRepository.save(request);
    }


    public List<MaterialRequest> getAllMaterialRequests() {
        return materialRequestRepository.findAll();
    }
}
