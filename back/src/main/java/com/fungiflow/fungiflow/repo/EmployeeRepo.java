package com.fungiflow.fungiflow.repo;

import com.fungiflow.fungiflow.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepo extends JpaRepository<Employee, Long> {

    boolean existsByNic(String nic);
}