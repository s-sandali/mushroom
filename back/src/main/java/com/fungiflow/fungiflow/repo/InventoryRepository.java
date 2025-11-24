package com.fungiflow.fungiflow.repo;

import com.fungiflow.fungiflow.model.InventoryItem;
import com.fungiflow.fungiflow.model.MaterialType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
    List<InventoryItem> findByQuantityLessThanEqual(int threshold);

    InventoryItem findByMaterialType(MaterialType materialType);
}
