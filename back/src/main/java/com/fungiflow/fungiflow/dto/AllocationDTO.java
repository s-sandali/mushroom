package com.fungiflow.fungiflow.dto;

public class AllocationDTO {

    private Long seedId;
    private int salesCenterQty;
    private int productionQty;

    public Long getSeedId() {
        return seedId;
    }

    public void setSeedId(Long seedId) {
        this.seedId = seedId;
    }

    public int getSalesCenterQty() {
        return salesCenterQty;
    }

    public void setSalesCenterQty(int salesCenterQty) {
        this.salesCenterQty = salesCenterQty;
    }

    public int getProductionQty() {
        return productionQty;
    }

    public void setProductionQty(int productionQty) {
        this.productionQty = productionQty;
    }
}
