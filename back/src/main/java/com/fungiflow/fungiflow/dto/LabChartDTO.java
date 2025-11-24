package com.fungiflow.fungiflow.dto;

public class LabChartDTO {
    private String label; // Could be month name or year
    private long successCount;
    private long contaminatedCount;

    public LabChartDTO(String label, long successCount, long contaminatedCount) {
        this.label = label;
        this.successCount = successCount;
        this.contaminatedCount = contaminatedCount;
    }

    public String getLabel() {
        return label;
    }

    public long getSuccessCount() {
        return successCount;
    }

    public long getContaminatedCount() {
        return contaminatedCount;
    }
}
