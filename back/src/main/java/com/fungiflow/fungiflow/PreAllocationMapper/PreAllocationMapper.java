package com.fungiflow.fungiflow.PreAllocationMapper;

import com.fungiflow.fungiflow.dto.PreAllocationDto;
import com.fungiflow.fungiflow.model.PreAllocation;

public class PreAllocationMapper {
    public static PreAllocationDto mapToPreAllocationDto(PreAllocation preAllocation) {
        return new PreAllocationDto(
                preAllocation.getId(),
                preAllocation.getBranch() != null ? preAllocation.getBranch().getBranchId() : null,
                preAllocation.getProduct() != null ? preAllocation.getProduct().getProduct_id() : null,
                preAllocation.getTotalQty(),
                preAllocation.getAllocatedQty(),
                preAllocation.getDate()
        );
    }

    public static PreAllocation mapToPreAllocation(PreAllocationDto dto) {
        PreAllocation preAllocation = new PreAllocation();
        preAllocation.setId(dto.getId());
        preAllocation.setTotalQty(dto.getTotalQty());
        preAllocation.setAllocatedQty(dto.getAllocatedQty());
        preAllocation.setDate(dto.getDate());
        return preAllocation;
    }
}
