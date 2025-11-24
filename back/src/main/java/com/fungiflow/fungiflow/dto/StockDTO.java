package com.fungiflow.fungiflow.dto;     

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockDTO {
    private Long tid;
    private String material;
    private Integer stock;
}
