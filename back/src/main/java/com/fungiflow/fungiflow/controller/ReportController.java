package com.fungiflow.fungiflow.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fungiflow.fungiflow.service.ReportService;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);

    @Autowired
    private ReportService reportService;

    @GetMapping("/sales")
    public ResponseEntity<ByteArrayResource> getSalesReport(
            @RequestParam String type,
            @RequestParam int year,
            @RequestParam(required = false) Integer month,
            @RequestParam String generatedBy
    ) {
        // Default the month to January if it's not provided
        int finalMonth = (month != null) ? month : 1;

        try {
            // Generate the report PDF
            byte[] pdf = reportService.generateSalesReport(type, year, finalMonth, generatedBy);
            ByteArrayResource resource = new ByteArrayResource(pdf);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=sales_report_" + year + "_" + finalMonth + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .contentLength(pdf.length)
                    .body(resource);

        } catch (Exception e) {
            // Log the error for debugging purposes
            logger.error("Error generating sales report: {}", e.getMessage(), e);

            // Return a 500 status with a message
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ByteArrayResource("Failed to generate report".getBytes()));
        }
    }
    @GetMapping("/lab")
    public ResponseEntity<ByteArrayResource> getLabReport(
            @RequestParam String type,
            @RequestParam int year,
            @RequestParam(required = false) Integer month,
            @RequestParam String generatedBy
    ) {
        int finalMonth = (month != null) ? month : 1;

        try {
            byte[] pdf = reportService.generateLabReport(type, year, finalMonth, generatedBy);
            ByteArrayResource resource = new ByteArrayResource(pdf);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=lab_report_" + year + "_" + finalMonth + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .contentLength(pdf.length)
                    .body(resource);

        } catch (Exception e) {
            logger.error("Error generating lab report: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ByteArrayResource("Failed to generate lab report".getBytes()));
        }
    }


}
