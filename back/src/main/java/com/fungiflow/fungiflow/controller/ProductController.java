package com.fungiflow.fungiflow.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fungiflow.fungiflow.dto.ProductDto;
import com.fungiflow.fungiflow.service.ProductService;

import lombok.AllArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@AllArgsConstructor
@RestController
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;

    // Build add product REST API
    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductDto productDto) {
        ProductDto savedProduct = productService.createProduct(productDto);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    // Build get product by ID REST API
    @GetMapping("{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable("id") Long productId) {
        ProductDto productDto = productService.getProductById(productId);
        return ResponseEntity.ok(productDto);
    }

    // Build get all products REST API
    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        List<ProductDto> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    // Build update product REST API
    @PutMapping("{id}")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable("id") Long productId, @RequestBody ProductDto updatedProduct) {
        ProductDto productDto = productService.updateProduct(productId, updatedProduct);
        return ResponseEntity.ok(productDto);
    }

    // Build delete product REST API
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable("id") Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok("Deleted successfully");
    }

    // Test endpoint to simulate stock reduction
    @PostMapping("/{id}/test-stock")
    public ResponseEntity<String> testStockNotification(
            @PathVariable("id") Long productId,
            @RequestParam(defaultValue = "1") int reduceBy) {
        try {
            // Get current product state
            ProductDto before = productService.getProductById(productId);
            
            // Update quantity
            productService.updateProductQuantity(productId, reduceBy);
            
            // Get updated product state
            ProductDto after = productService.getProductById(productId);
            
            return ResponseEntity.ok(String.format(
                "Stock update successful:\n" +
                "Before - Quantity: %d, Threshold: %d\n" +
                "After  - Quantity: %d, Threshold: %d",
                before.getQuantity(), before.getThreshold(),
                after.getQuantity(), after.getThreshold()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
