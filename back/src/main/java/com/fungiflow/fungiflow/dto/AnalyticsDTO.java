package com.fungiflow.fungiflow.dto;

import java.util.Map;

public class AnalyticsDTO {

    private Map<String, Double> successRatesByType;
    private Map<String, Integer> contaminationByReason;
    private int totalSuccessful;
    private int totalContaminated;

    public Map<String, Double> getSuccessRatesByType() {
        return successRatesByType;
    }

    public void setSuccessRatesByType(Map<String, Double> successRatesByType) {
        this.successRatesByType = successRatesByType;
    }

    public Map<String, Integer> getContaminationByReason() {
        return contaminationByReason;
    }

    public void setContaminationByReason(Map<String, Integer> contaminationByReason) {
        this.contaminationByReason = contaminationByReason;
    }

    public int getTotalSuccessful() {
        return totalSuccessful;
    }

    public void setTotalSuccessful(int totalSuccessful) {
        this.totalSuccessful = totalSuccessful;
    }

    public int getTotalContaminated() {
        return totalContaminated;
    }

    public void setTotalContaminated(int totalContaminated) {
        this.totalContaminated = totalContaminated;
    }
}
