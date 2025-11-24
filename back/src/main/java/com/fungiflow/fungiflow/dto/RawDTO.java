package com.fungiflow.fungiflow.dto;     

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RawDTO {
    private Long id;
    private String material;
    private Integer stock;
}
