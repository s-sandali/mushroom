package com.fungiflow.fungiflow.model;

import jakarta.persistence.*;

@Entity
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MaterialType materialType; // Use shared enum

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private int thresholdLevel;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public MaterialType getMaterialType() { return materialType; }
    public void setMaterialType(MaterialType materialType) { this.materialType = materialType; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public int getThresholdLevel() { return thresholdLevel; }
    public void setThresholdLevel(int thresholdLevel) { this.thresholdLevel = thresholdLevel; }
}
