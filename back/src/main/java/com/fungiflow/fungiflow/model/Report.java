package com.fungiflow.fungiflow.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "report")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reportType; // "MONTHLY" or "ANNUAL"
    private String fileName;
    private String filePath;

    private LocalDateTime generatedDateTime;
    private String generatedBy;

    public Report() {}

    public Report(String reportType, String fileName, String filePath, LocalDateTime generatedDateTime, String generatedBy) {
        this.reportType = reportType;
        this.fileName = fileName;
        this.filePath = filePath;
        this.generatedDateTime = generatedDateTime;
        this.generatedBy = generatedBy;
    }

}
