package com.fungiflow.fungiflow.dto;

public class MaterialRequestDTO {

    private Long materialId; // Reference InventoryItem's ID
    private int quantity;
    private String requester;

    public Long getMaterialId() {
        return materialId;
    }

    public void setMaterialId(Long materialId) {
        this.materialId = materialId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getRequester() {
        return requester;
    }

    public void setRequester(String requester) {
        this.requester = requester;
    }
}
