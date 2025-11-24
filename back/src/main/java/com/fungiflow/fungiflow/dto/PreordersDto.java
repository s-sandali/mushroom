package com.fungiflow.fungiflow.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PreordersDto {
    private long id;
    private String customer_name;
    private String product_name;
    private double unit_price;
    private int quantity;
    private double price;
    private String date;
    private long product_id;
}
