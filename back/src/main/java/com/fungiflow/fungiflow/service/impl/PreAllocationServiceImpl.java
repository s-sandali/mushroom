package com.fungiflow.fungiflow.service.impl;


import com.fungiflow.fungiflow.PreAllocationMapper.PreAllocationMapper;
import com.fungiflow.fungiflow.dto.PreAllocationDto;
import com.fungiflow.fungiflow.exception.ResourceNotFoundException;
import com.fungiflow.fungiflow.model.Branch;
import com.fungiflow.fungiflow.model.PreAllocation;
import com.fungiflow.fungiflow.model.Product;
import com.fungiflow.fungiflow.repo.BranchRepository;
import com.fungiflow.fungiflow.repo.PreAllocationRepository;
import com.fungiflow.fungiflow.repo.ProductRepository;
import com.fungiflow.fungiflow.service.PreAllocationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor

public class PreAllocationServiceImpl implements PreAllocationService {
    private final PreAllocationRepository preallocationRepository;
    private final BranchRepository branchRepository;
    private final ProductRepository productRepository;

    @Override
    public PreAllocationDto createPreAllocation(Long branchId, PreAllocationDto preallocationDto) {
        if (branchId == null) {
            throw new IllegalArgumentException("Branch ID must not be null");
        }

        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + branchId));

        Product product = productRepository.findById(preallocationDto.getProduct_id())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + preallocationDto.getProduct_id()));

        PreAllocation preallocation = PreAllocationMapper.mapToPreAllocation(preallocationDto);
        preallocation.setBranch(branch);
        preallocation.setProduct(product);

        preallocation = preallocationRepository.save(preallocation);
        return PreAllocationMapper.mapToPreAllocationDto(preallocation);
    }



    @Override
    public PreAllocationDto getPreAllocationById(Long id) {
        PreAllocation preallocation = preallocationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Allocation not found with id: " + id));
        return PreAllocationMapper.mapToPreAllocationDto(preallocation);
    }

    @Override
    public List<PreAllocationDto> getAllPreAllocations() {
        return preallocationRepository.findAll().stream()
                .map(PreAllocationMapper::mapToPreAllocationDto)
                .collect(Collectors.toList());
    }

    @Override
    public PreAllocationDto updatePreAllocation(Long id, PreAllocationDto preallocationDto) {
        PreAllocation preallocation = preallocationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pre order Allocation not found with id: " + id));

        preallocation.setTotalQty(preallocationDto.getTotalQty());
        preallocation.setAllocatedQty(preallocationDto.getAllocatedQty());


        preallocation = preallocationRepository.save(preallocation);
        return PreAllocationMapper.mapToPreAllocationDto(preallocation);
    }

    @Override
    public void deletePreAllocation(Long id) {

        preallocationRepository.deleteById(id);
    }


    @Override
    public void allocateProductsToBranch(Long branchId, Long productId, int quantity) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + branchId));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        PreAllocation preallocation = new PreAllocation();
        preallocation.setBranch(branch);
        preallocation.setProduct(product);
        preallocation.setTotalQty(quantity);
        preallocation.setAllocatedQty(0);

        preallocationRepository.save(preallocation);
    }
}
