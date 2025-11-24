package com.fungiflow.fungiflow.service.impl;


import com.fungiflow.fungiflow.BranchMapper.BranchMapper;
import com.fungiflow.fungiflow.dto.BranchDto;
import com.fungiflow.fungiflow.exception.ResourceNotFoundException;
import com.fungiflow.fungiflow.model.Branch;
import com.fungiflow.fungiflow.repo.BranchRepository;
import com.fungiflow.fungiflow.service.BranchService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class BranchServiceImpl implements BranchService {
    private final BranchRepository branchRepository;

    @Override
    public BranchDto createBranch(BranchDto branchDto) {
        Branch branch = BranchMapper.mapToBranch(branchDto);
        Branch savedBranch = branchRepository.save(branch);
        return BranchMapper.mapToBranchDto(savedBranch);
    }

    @Override
    public BranchDto getBranchById(Long branchID) {
        Branch branch = branchRepository.findById(branchID)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with given id: " + branchID));
        return BranchMapper.mapToBranchDto(branch);
    }

    @Override
    public List<BranchDto> getAllBranches() {
        List<Branch> branches = branchRepository.findAll();

        return branches.stream().map(BranchMapper::mapToBranchDto)
                .collect(Collectors.toList());
    }

    @Override
    public BranchDto updateBranch(Long branchID, BranchDto updatedBranch) {
        Branch branch = branchRepository.findById(branchID).orElseThrow(
                () -> new ResourceNotFoundException("Branch not found with given id: " + branchID));

        branch.setBranchName(updatedBranch.getBranchName());
        branch.setLocation(updatedBranch.getLocation());

        Branch updatedBranchObj = branchRepository.save(branch);
        return BranchMapper.mapToBranchDto(updatedBranchObj);
    }

    @Override
    public void deleteBranch(Long branchID) {
        Branch branch = branchRepository.findById(branchID)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with given id: " + branchID));
        branchRepository.delete(branch);
    }
}

