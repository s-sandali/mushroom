package com.fungiflow.fungiflow.service;



import com.fungiflow.fungiflow.dto.SalesDto;

import java.util.List;

public interface SalesService {
    SalesDto createSales(SalesDto salesDto);

    SalesDto getSalesById(Long salesID);

    List<SalesDto> getAllSales();

    SalesDto updateSales(Long salesID, SalesDto updatedSales);

    void deleteSales(Long salesID);
}
