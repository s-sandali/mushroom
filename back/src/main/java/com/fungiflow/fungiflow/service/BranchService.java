package com.fungiflow.fungiflow.service;

import com.fungiflow.fungiflow.dto.BranchDto;

import java.util.List;

public interface BranchService {
    BranchDto createBranch(BranchDto branchDto);
    BranchDto getBranchById(Long id);
    List<BranchDto> getAllBranches();
    BranchDto updateBranch(Long id, BranchDto branchDto);
    void deleteBranch(Long id);
}

