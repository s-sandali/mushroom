package com.fungiflow.fungiflow.ProductMapper;


import com.fungiflow.fungiflow.dto.ProductDto;
import com.fungiflow.fungiflow.model.Product;

public class ProductMapper {


    public static ProductDto mapToProductDto(Product product) {
        if (product == null) {
            return null;
        }


        return new ProductDto(
                product.getProduct_id(),
                product.getName(),
                product.getQuantity(),
                product.getUnitPrice(),
                null,
                product.getThresholdLevel()
        );

    }

    // Convert ProductDto to Product entity
    public static Product mapToProduct(ProductDto productDto) {
        Product product = new Product();
        product.setProduct_id(productDto.getProductId());
        product.setName(productDto.getName());
        product.setQuantity(productDto.getQuantity());
        product.setUnitPrice(productDto.getUnitPrice());
        product.setThresholdLevel(productDto.getThreshold());
        return product;
    }



}
