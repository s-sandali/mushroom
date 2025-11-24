package com.fungiflow.fungiflow.BranchMapper;

import com.fungiflow.fungiflow.dto.BranchDto;
import com.fungiflow.fungiflow.model.Branch;

public class BranchMapper {
    public static BranchDto mapToBranchDto(Branch branch) {
        return new BranchDto(
                branch.getBranchId(),
                branch.getBranchName(),
                branch.getLocation()
        );
    }

    public static Branch mapToBranch(BranchDto branchDto) {
        Branch branch = new Branch();
        branch.setId(branchDto.getId());
        branch.setBranchName(branchDto.getBranchName());
        branch.setLocation(branchDto.getLocation());
        return branch;
    }
}