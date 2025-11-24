package com.fungiflow.fungiflow.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fungiflow.fungiflow.dto.SalesDto;
import com.fungiflow.fungiflow.service.SalesService;

import lombok.AllArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@AllArgsConstructor
@RestController

@RequestMapping("/api/Sold")
public class SalesController {

    private SalesService salesService;

    //Build add sale REST API
    @PostMapping
    public ResponseEntity<SalesDto> createSales(@RequestBody SalesDto salesDto) {
        SalesDto savedSales = salesService.createSales(salesDto);
        return new ResponseEntity<>(savedSales, HttpStatus.CREATED);
    }

    //Build get sale REST API
    @GetMapping("{id}")
    public ResponseEntity<SalesDto> getSalesByID(@PathVariable("id") Long salesID) {
        SalesDto salesDto = salesService.getSalesById(salesID);
        return ResponseEntity.ok(salesDto);
    }

    //Build get all sales REST API
    @GetMapping
    public ResponseEntity<List<SalesDto>> getAllSales() {
        List<SalesDto> sales = salesService.getAllSales();
        return ResponseEntity.ok(sales);
    }

    //Build update sales REST API
    @PutMapping("{id}")
    public ResponseEntity<SalesDto> updateSales(@PathVariable("id") Long salesID, @RequestBody SalesDto updatedSales) {
        SalesDto salesDto = salesService.updateSales(salesID, updatedSales);
        return ResponseEntity.ok(salesDto);
    }

    //Build delete sales REST API
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteSales(@PathVariable("id") Long salesID) {
        salesService.deleteSales(salesID);
        return ResponseEntity.ok("Deleted successfully");
    }
}




