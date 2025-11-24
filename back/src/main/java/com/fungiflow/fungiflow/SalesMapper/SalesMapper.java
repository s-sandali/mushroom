package com.fungiflow.fungiflow.SalesMapper;


import com.fungiflow.fungiflow.dto.SalesDto;
import com.fungiflow.fungiflow.model.Sales;

import java.time.LocalDate;

public class SalesMapper {
    public static SalesDto mapToSalesDto(Sales sales){
        return  new SalesDto(
                sales.getId(),
                sales.getCustomerName(),
                sales.getProductName(),
                sales.getUnitPrice(),
                sales.getQuantity(),
                sales.getPrice(),
                sales.getDate().toString(),
                sales.getProduct() != null ? sales.getProduct().getProduct_id() : null
        );
    }

    public static Sales mapToSales(SalesDto salesDto) {
        System.out.println("QUANTITY FROM DTO: " + salesDto.getQuantity());
        Sales sales = new Sales();
        if (salesDto.getId() != null) {
            sales.setId(salesDto.getId());
        }
        sales.setCustomerName(salesDto.getCustomer_name());
        sales.setProductName(salesDto.getProduct_name());
        sales.setUnitPrice(salesDto.getUnit_price());
        sales.setQuantity(salesDto.getQuantity());
        sales.setPrice(salesDto.getPrice());
        sales.setDate(LocalDate.parse(salesDto.getDate()));

        return sales;
    }
}