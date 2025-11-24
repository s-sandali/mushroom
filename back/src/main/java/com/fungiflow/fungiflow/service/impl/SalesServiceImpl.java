package com.fungiflow.fungiflow.service.impl;


import com.fungiflow.fungiflow.SalesMapper.SalesMapper;
import com.fungiflow.fungiflow.dto.SalesDto;
import com.fungiflow.fungiflow.exception.ResourceNotFoundException;
import com.fungiflow.fungiflow.model.Product;
import com.fungiflow.fungiflow.model.Sales;
import com.fungiflow.fungiflow.repo.SalesRepository;
import com.fungiflow.fungiflow.service.ProductService;
import com.fungiflow.fungiflow.service.SalesService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor

public class SalesServiceImpl implements SalesService {
    private SalesRepository salesRepository;
    private ProductService productService;

    @Override
    public SalesDto createSales(SalesDto salesDto) {
        Sales sales = SalesMapper.mapToSales(salesDto);

        Product product = productService.getProductEntityById(salesDto.getProduct_id()); // Use the entity, not DTO
        sales.setProduct(product);

        Sales savedSales = salesRepository.save(sales);
        productService.updateProductQuantity(product.getProduct_id(), salesDto.getQuantity());

        return SalesMapper.mapToSalesDto(savedSales);
    }


    @Override
    public SalesDto getSalesById(Long salesID) {
        Sales sales = salesRepository.findById(salesID)
                .orElseThrow(() -> new ResourceNotFoundException("Sale is not found with given id"));
        return SalesMapper.mapToSalesDto(sales);
    }

    @Override
    public List<SalesDto> getAllSales() {
        List<Sales> sale = salesRepository.findAll();

        return sale.stream().map((sales) -> SalesMapper.mapToSalesDto(sales))
                .collect(Collectors.toList());
    }

    @Override
    public SalesDto updateSales(Long salesID, SalesDto updatedSales) {
        Sales sales =salesRepository.findById(salesID).orElseThrow(
                () -> new ResourceNotFoundException("Sale is not found with given id"+ salesID));
        sales.setCustomerName(updatedSales.getCustomer_name());
        sales.setProductName(updatedSales.getProduct_name());
        sales.setUnitPrice(updatedSales.getUnit_price());
        sales.setQuantity(updatedSales.getQuantity());
        sales.setPrice(updatedSales.getPrice());
        sales.setDate(LocalDate.parse(updatedSales.getDate()));

        Sales updatedSalesObj = salesRepository.save(sales);
        return SalesMapper.mapToSalesDto(updatedSalesObj);
    }

    @Override
    public void deleteSales(Long salesID) {
        Sales sales =salesRepository.findById(salesID).orElseThrow(
                () -> new ResourceNotFoundException("Sale is not found with given id"+ salesID));
        salesRepository.deleteById(salesID);
    }
}
