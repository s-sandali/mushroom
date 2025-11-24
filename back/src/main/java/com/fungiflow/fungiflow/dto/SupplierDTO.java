package com.fungiflow.fungiflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierDTO {
    private Long sid;
    private String supplier;
    private String material;
    private String address;
    private Integer phone;
}
