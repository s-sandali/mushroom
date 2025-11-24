package com.fungiflow.fungiflow.repo;


import com.fungiflow.fungiflow.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByQuantityLessThanEqual(int threshold);
}


