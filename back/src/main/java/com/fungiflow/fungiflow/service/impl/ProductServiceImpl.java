package com.fungiflow.fungiflow.service.impl;


import com.fungiflow.fungiflow.Event.StockLevelEvent;
import com.fungiflow.fungiflow.ProductMapper.ProductMapper;
import com.fungiflow.fungiflow.dto.ProductDto;
import com.fungiflow.fungiflow.exception.ResourceNotFoundException;
import com.fungiflow.fungiflow.model.Product;
import com.fungiflow.fungiflow.repo.ProductRepository;
import com.fungiflow.fungiflow.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public Product getProductEntityById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Override
    public ProductDto createProduct(ProductDto productDto) {
        productDto.setProductId(null);
        Product product = ProductMapper.mapToProduct(productDto);
        Product savedProduct = productRepository.save(product);

        checkStockLevel(savedProduct);

        ProductDto resultDto = ProductMapper.mapToProductDto(savedProduct);
        resultDto.setStatus(calculateStatus(savedProduct));
        return resultDto;
    }

    @Override
    public ProductDto getProductById(Long product_id) {
        Product product = productRepository.findById(product_id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + product_id));

        ProductDto dto = ProductMapper.mapToProductDto(product);
        dto.setStatus(calculateStatus(product));
        return dto;
    }

    @Override
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(product -> {
                    ProductDto dto = ProductMapper.mapToProductDto(product);
                    dto.setStatus(calculateStatus(product));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public ProductDto updateProduct(Long product_id, ProductDto updatedDto) {
        Product product = productRepository.findById(product_id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + product_id));


        product.setName(updatedDto.getName());
        product.setQuantity(updatedDto.getQuantity());
        product.setUnitPrice(updatedDto.getUnitPrice());
        product.setThresholdLevel(updatedDto.getThreshold());

        Product updatedProduct = productRepository.save(product);
        
        checkStockLevel(updatedProduct);

        ProductDto resultDto = ProductMapper.mapToProductDto(updatedProduct);
        resultDto.setStatus(calculateStatus(updatedProduct));
        return resultDto;
    }

    @Override
    public void deleteProduct(Long product_id) {
        if (!productRepository.existsById(product_id)) {
            throw new ResourceNotFoundException("Product not found with id: " + product_id);
        }
        productRepository.deleteById(product_id);
    }

    @Override
    public void updateProductQuantity(Long product_id, int quantityChange) {
        Product product = getProductEntityById(product_id);
        
        int newQuantity = product.getQuantity() - quantityChange;
        if (newQuantity < 0) {
            throw new IllegalArgumentException("Not enough stock available.");
        }

        product.setQuantity(newQuantity);
        Product savedProduct = productRepository.save(product);
        
        checkStockLevel(savedProduct);
    }

    private void checkStockLevel(Product product) {
        if (product.getQuantity() <= product.getThresholdLevel()) {
            eventPublisher.publishEvent(new StockLevelEvent(
                this,
                product.getProduct_id(),
                product.getQuantity(),
                product.getThresholdLevel()
            ));
        }
    }

    private String calculateStatus(Product product) {
        if (product.getQuantity() == 0) {
            return "Out of Stock";
        } else if (product.getQuantity() < product.getThresholdLevel()) {
            return "Low Stock";
        } else {
            return "In Stock";
        }
    }
}
