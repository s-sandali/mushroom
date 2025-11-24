package com.fungiflow.fungiflow.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PreAllocationDto {
    private Long id;
    private Long branchId;
    private Long product_id;
    private int totalQty;
    private int allocatedQty;
    private LocalDate date;
}
