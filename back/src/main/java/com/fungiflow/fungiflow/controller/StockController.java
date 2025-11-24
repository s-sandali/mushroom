package com.fungiflow.fungiflow.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fungiflow.fungiflow.dto.StockDTO;
import com.fungiflow.fungiflow.service.StockService;


@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping(value = "api/v4/")
public class StockController {
    @Autowired
    private StockService StockService;

    @GetMapping("/getStocks")
    public List<StockDTO> getStocks() {
        return StockService.getAllStocks();
    }
}
