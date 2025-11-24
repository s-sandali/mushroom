package com.fungiflow.fungiflow.dto;

import com.fungiflow.fungiflow.model.Seed;

public class ContaminationStatDTO {

    private Seed.MushroomType type;
    private int totalBatches;
    private int contaminatedBatches;
    private double contaminationRate;

    public ContaminationStatDTO() {}

    public ContaminationStatDTO(Seed.MushroomType type, int totalBatches, int contaminatedBatches, double contaminationRate) {
        this.type = type;
        this.totalBatches = totalBatches;
        this.contaminatedBatches = contaminatedBatches;
        this.contaminationRate = contaminationRate;
    }

    public Seed.MushroomType getType() {
        return type;
    }

    public void setType(Seed.MushroomType type) {
        this.type = type;
    }

    public int getTotalBatches() {
        return totalBatches;
    }

    public void setTotalBatches(int totalBatches) {
        this.totalBatches = totalBatches;
    }

    public int getContaminatedBatches() {
        return contaminatedBatches;
    }

    public void setContaminatedBatches(int contaminatedBatches) {
        this.contaminatedBatches = contaminatedBatches;
    }

    public double getContaminationRate() {
        return contaminationRate;
    }

    public void setContaminationRate(double contaminationRate) {
        this.contaminationRate = contaminationRate;
    }
}
