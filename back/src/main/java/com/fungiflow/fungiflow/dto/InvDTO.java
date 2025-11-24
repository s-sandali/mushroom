package com.fungiflow.fungiflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvDTO {
    private Long nid;
    private String material;
    private String usageType;
    private Integer Used_stock;
}
