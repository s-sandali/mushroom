package com.fungiflow.fungiflow.dto;

public class DailyUpdateDTO {

    private Long seedId;
    private int successfulToday;
    private int contaminatedToday;
    private String contaminationReason;

    public Long getSeedId() {
        return seedId;
    }

    public void setSeedId(Long seedId) {
        this.seedId = seedId;
    }

    public int getSuccessfulToday() {
        return successfulToday;
    }

    public void setSuccessfulToday(int successfulToday) {
        this.successfulToday = successfulToday;
    }

    public int getContaminatedToday() {
        return contaminatedToday;
    }

    public void setContaminatedToday(int contaminatedToday) {
        this.contaminatedToday = contaminatedToday;
    }

    public String getContaminationReason() {
        return contaminationReason;
    }

    public void setContaminationReason(String contaminationReason) {
        this.contaminationReason = contaminationReason;
    }
}
