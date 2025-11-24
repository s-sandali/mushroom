package com.fungiflow.fungiflow.repo;


import com.fungiflow.fungiflow.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepo extends JpaRepository<Supplier, Long> {
}
