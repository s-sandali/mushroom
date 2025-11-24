package com.fungiflow.fungiflow.service;



import com.fungiflow.fungiflow.dto.ProductDto;
import com.fungiflow.fungiflow.model.Product;

import java.util.List;

public interface ProductService {
    ProductDto createProduct(ProductDto productDto);

    Product getProductEntityById(Long id);

    ProductDto getProductById(Long product_id);

    List<ProductDto> getAllProducts();

    ProductDto updateProduct(Long product_id, ProductDto updatedDto);

    void deleteProduct(Long product_id);

    void updateProductQuantity(Long product_id, int quantityChange);

}
