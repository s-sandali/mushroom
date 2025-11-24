package com.fungiflow.fungiflow.repo;

import com.fungiflow.fungiflow.model.Allocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface AllocationRepository extends JpaRepository<Allocation, Long> {
    Optional<Allocation> findBySeedId(Long seedId);
}
