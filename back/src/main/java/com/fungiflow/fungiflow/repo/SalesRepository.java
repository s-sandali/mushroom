package com.fungiflow.fungiflow.repo;

import com.fungiflow.fungiflow.model.Sales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SalesRepository extends JpaRepository<Sales, Long> {

    // Change the query to return Long for quantity
    @Query("SELECT s.productName, FUNCTION('MONTH', s.date), SUM(s.quantity) FROM Sales s GROUP BY s.productName, FUNCTION('MONTH', s.date)")
    List<Object[]> getMonthlySalesSummary();
}
