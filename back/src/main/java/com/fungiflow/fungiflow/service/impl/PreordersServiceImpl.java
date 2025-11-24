package com.fungiflow.fungiflow.service.impl;


import com.fungiflow.fungiflow.PreordersMapper.PreordersMapper;
import com.fungiflow.fungiflow.dto.PreordersDto;
import com.fungiflow.fungiflow.exception.ResourceNotFoundException;
import com.fungiflow.fungiflow.model.Preorders;
import com.fungiflow.fungiflow.model.Product;
import com.fungiflow.fungiflow.repo.PreordersRepository;
import com.fungiflow.fungiflow.service.PreordersService;
import com.fungiflow.fungiflow.service.ProductService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class PreordersServiceImpl implements PreordersService {

    private final PreordersRepository preordersRepository;
    private final ProductService productService;  // Injected ProductService

    @Override
    public PreordersDto createPreorders(PreordersDto preordersDto) {
        // Map DTO to entity
        Preorders preorders = PreordersMapper.mapToPreorders(preordersDto);

        // Get the full product entity by ID
        Product product = productService.getProductEntityById(preordersDto.getProduct_id());
        
        // Validate product availability
        if (product.getQuantity() < preordersDto.getQuantity()) {
            throw new IllegalArgumentException("Not enough stock available. Available quantity: " + product.getQuantity());
        }

        // Set product details from the actual product
        preorders.setProduct(product);
        preorders.setProduct_name(product.getName());
        preorders.setUnit_price(product.getUnitPrice());
        preorders.setPrice(product.getUnitPrice() * preordersDto.getQuantity());

        // Save the preorder entity
        Preorders savedPreorders = preordersRepository.save(preorders);

        // Update product quantity by subtracting preorder quantity
        productService.updateProductQuantity(product.getProduct_id(), preordersDto.getQuantity());

        // Return the mapped DTO of saved preorder
        return PreordersMapper.mapToPreordersDto(savedPreorders);
    }


    @Override
    public PreordersDto getPreordersById(Long preordersId) {
        Preorders preorders = preordersRepository.findById(preordersId)
                .orElseThrow(() -> new ResourceNotFoundException("Preorder not found with given id"));
        return PreordersMapper.mapToPreordersDto(preorders);
    }

    @Override
    public List<PreordersDto> getAllPreorders() {
        try {
            log.info("Fetching all preorders");
            List<Preorders> preordersList = preordersRepository.findAll();
            
            if (preordersList.isEmpty()) {
                log.info("No preorders found");
                return new ArrayList<>();
            }

            List<PreordersDto> dtoList = preordersList.stream()
                .map(preorder -> {
                    try {
                        return PreordersMapper.mapToPreordersDto(preorder);
                    } catch (Exception e) {
                        log.error("Error mapping preorder with ID: " + preorder.getId(), e);
                        return null;
                    }
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());

            log.info("Successfully fetched {} preorders", dtoList.size());
            return dtoList;
        } catch (Exception e) {
            log.error("Error fetching all preorders", e);
            throw new RuntimeException("Failed to fetch preorders: " + e.getMessage());
        }
    }

    @Override
    public PreordersDto updatePreorders(Long preordersId, PreordersDto updatedPreorders) {
        Preorders preorders = preordersRepository.findById(preordersId)
                .orElseThrow(() -> new ResourceNotFoundException("Preorder not found with given id " + preordersId));

        // Get the product entity
        Product product = productService.getProductEntityById(updatedPreorders.getProduct_id());

        // Calculate quantity difference
        int quantityDifference = updatedPreorders.getQuantity() - preorders.getQuantity();
        
        // If quantity is increasing, check if enough stock is available
        if (quantityDifference > 0) {
            if (product.getQuantity() < quantityDifference) {
                throw new IllegalArgumentException("Not enough stock available. Available quantity: " + product.getQuantity());
            }
        }

        // Update preorder fields
        preorders.setCustomer_name(updatedPreorders.getCustomer_name());
        preorders.setProduct_name(product.getName());
        preorders.setUnit_price(product.getUnitPrice());
        preorders.setQuantity(updatedPreorders.getQuantity());
        preorders.setPrice(product.getUnitPrice() * updatedPreorders.getQuantity());
        preorders.setDate(updatedPreorders.getDate());
        preorders.setProduct(product);

        // Save the updated preorder
        Preorders updatedPreordersObj = preordersRepository.save(preorders);

        // Update product quantity if there's a change
        if (quantityDifference != 0) {
            productService.updateProductQuantity(product.getProduct_id(), quantityDifference);
        }

        return PreordersMapper.mapToPreordersDto(updatedPreordersObj);
    }

    @Override
    public void deletePreorders(Long preordersId) {
        Preorders preorders = preordersRepository.findById(preordersId)
                .orElseThrow(() -> new ResourceNotFoundException("Preorder not found with given id " + preordersId));
        preordersRepository.deleteById(preordersId);
    }

    public List<Object[]> TotalPreorders() {
        return preordersRepository.TotalPreorders();
    }
}
